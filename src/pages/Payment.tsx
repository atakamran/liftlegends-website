
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentHeader from "@/components/payment/PaymentHeader";

const Payment = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <PaymentHeader />
      <div className="container mx-auto px-4 py-8">
        <PaymentForm />
      </div>
    </div>
  );
};

export default Payment;
