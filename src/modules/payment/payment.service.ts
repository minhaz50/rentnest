import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { config } from "../../config";

const stripe = new Stripe(config.stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

export const createPayment = async (
  tenantId: string,
  rentalRequestId: string,
  provider: "STRIPE" | "SSLCOMMERZ",
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true, payment: true, tenant: true },
  });

  if (!rentalRequest) throw new ApiError(404, "Rental request not found.");
  if (rentalRequest.tenantId !== tenantId)
    throw new ApiError(403, "This is not your request.");
  if (rentalRequest.status !== "APPROVED") {
    throw new ApiError(400, "Rental request must be APPROVED before payment.");
  }
  if (rentalRequest.payment) {
    throw new ApiError(
      409,
      "A payment already exists for this rental request.",
    );
  }

  const amount = rentalRequest.property.price;
  const transactionId = generateTransactionId(provider === "STRIPE");

  const payment = await prisma.payment.create({
    data: {
      transactionId,
      amount,
      provider,
      rentalRequestId,
      userId: tenantId,
    },
  });

  if (provider === "STRIPE") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: rentalRequest.tenant.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Rent payment - ${rentalRequest.property.title}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { transactionId },
      success_url: `${config.clientSuccessUrl}?transactionId=${transactionId}`,
      cancel_url: `${config.clientCancelUrl}?transactionId=${transactionId}`,
    });

    return { payment, redirectUrl: session.url };
  }
};

const markPaymentCompleted = async (transactionId: string, method: string) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
  });
  if (!payment) throw new ApiError(404, "Payment not found.");
  if (payment.status === "COMPLETED") return payment;

  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { transactionId },
      data: { status: "COMPLETED", paidAt: new Date(), method },
    }),
    prisma.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: "ACTIVE" },
    }),
  ]);

  return updatedPayment;
};

export const confirmPayment = async (transactionId: string) => {
  return markPaymentCompleted(transactionId, "manual");
};

export const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string,
) => {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    config.stripeWebhookSecret,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const transactionId = session.metadata?.transactionId;
    if (transactionId) {
      await markPaymentCompleted(transactionId, "card");
    }
  }
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      rentalRequest: {
        include: { property: { select: { id: true, title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { rentalRequest: { include: { property: true } } },
  });
  if (!payment) throw new ApiError(404, "Payment not found.");

  const isOwner = payment.userId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;
  if (!isOwner && !isLandlord && role !== "ADMIN") {
    throw new ApiError(403, "You do not have access to this payment.");
  }
  return payment;
};

export const paymentService = {
  createPayment,
  markPaymentCompleted,
  confirmPayment,
  getPaymentById,
  getMyPayments,
  handleStripeWebhook,
};
