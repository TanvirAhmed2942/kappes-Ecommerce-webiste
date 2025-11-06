"use client";
import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetFAQsQuery } from "@/redux/policies&faqApi/policies&faqApi";
import useToast from "@/hooks/useShowToast";

export default function FAQSection() {
  const { data: faqs, isLoading, error } = useGetFAQsQuery();
  // State to track which FAQ is open - must be called before any early returns
  const [openFAQ, setOpenFAQ] = useState(1);
  const toast = useToast();

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      // Extract error message from different possible error structures
      let errorMessage = "Failed to fetch FAQs";

      if (error.data?.errorMessages && error.data.errorMessages.length > 0) {
        // Handle errorMessages array format: [{ path: "...", message: "API DOESN'T EXIST" }]
        errorMessage = error.data.errorMessages[0].message;
      } else if (error.data?.message) {
        // Handle direct message format
        errorMessage = error.data.message;
      } else if (error.message) {
        // Handle standard error message
        errorMessage = error.message;
      }

      toast.showError(errorMessage);
    }
  }, [error, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // console.log("faqs", faqs)
  const faqItems =
    faqs?.data?.map((faq) => ({
      id: faq._id,
      question: faq.question,
      answer: faq.answer,
    })) || [];
  console.log("faqItems", faqItems);

  //   {
  //     id: 1,
  //     question: "How can I track my order?",
  //     answer:
  //       "To register, simply visit our website or mobile app and sign up with your phone number. Then, complete your profile, provide your business details, and you're ready to start selling!",
  //   },
  //   {
  //     id: 2,
  //     question: "Is there any fee to create a seller account?",
  //     answer:
  //       "No, creating a seller account on The Canuck Mall is completely free. There are no registration fees or monthly subscription charges to get started. We only charge a small commission on successful sales.",
  //   },
  //   {
  //     id: 3,
  //     question: "How do I list my products for sale?",
  //     answer:
  //       "After creating your seller account, you can add products by navigating to your seller dashboard. Click on 'Add Products', fill in the required details including product name, description, images, price, and inventory quantity. Once submitted, our team will review your listing and approve it within 24-48 hours.",
  //   },
  //   {
  //     id: 4,
  //     question: "What happens if a customer requests a return?",
  //     answer:
  //       "When a customer requests a return, you'll receive a notification in your seller dashboard. You'll have 24 hours to review and respond to the request. If approved, the customer will ship the item back. Once you confirm receipt of the returned item, the refund will be processed according to your return policy.",
  //   },
  //   {
  //     id: 5,
  //     question: "What is the Payment Policy of The Canuck Mall?",
  //     answer:
  //       "The Canuck Mall processes payments to sellers on a weekly basis. After a sale is completed and the return period has passed, the payment will be transferred to your registered bank account. We deduct our commission fee before transferring the funds. You can track all your transactions in the 'Payments' section of your seller dashboard.",
  //   },
  // ];

  // Function to toggle FAQ open/close
  const toggleFAQ = (id) => {
    if (openFAQ === id) {
      setOpenFAQ(null); // Close if already open
    } else {
      setOpenFAQ(id); // Open the clicked FAQ
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl lg:text-4xl text-center mb-10 font-comfortaa font-extrabold md:leading-14">
        Frequently Asked Questions (FAQs)
      </h2>

      <div className="space-y-4">
        {faqItems.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-md shadow-sm overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none transition-colors hover:bg-gray-50"
              onClick={() => toggleFAQ(faq.id)}
              aria-expanded={openFAQ === faq.id}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <span className="text-base md:text-lg font-bold font-comfortaa">
                {faq.question}
              </span>
              <motion.span
                className="flex-shrink-0 ml-2"
                animate={{ rotate: openFAQ === faq.id ? 0 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {openFAQ === faq.id ? (
                  <motion.div
                    className="bg-red-700 p-1 text-white rounded-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Minus size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    className="bg-white border border-red-700 p-1 text-red-700 rounded-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={16} />
                  </motion.div>
                )}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openFAQ === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { duration: 0.25, delay: 0.05 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: "easeIn" },
                      opacity: { duration: 0.2 },
                    },
                  }}
                  id={`faq-answer-${faq.id}`}
                  className="overflow-hidden"
                >
                  <div className="p-4 md:p-5 pt-2 text-sm md:text-base text-gray-600 border-t border-gray-100 font-comfortaa">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
