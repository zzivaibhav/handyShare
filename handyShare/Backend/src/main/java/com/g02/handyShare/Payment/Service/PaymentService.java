package com.g02.handyShare.Payment.Service;

import com.g02.handyShare.Payment.Request.PaymentRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private static final String STRIPE_SECRET_KEY = "sk_test_51QCMlpCj4cfMdtSgvGv3Y949jGNTGjZbSWHD6GKUJ0hczCCQ8f5SPtX91LqFA4RLPn96F4KsoG8mwjwPEmwEafUf00wIvarU3p";

    public PaymentService() {
        Stripe.apiKey = STRIPE_SECRET_KEY;
    }

    public Map<String, Object> onboardCustomer(PaymentRequest paymentRequest) {
        try {
            CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(paymentRequest.getEmail())
                .setName(paymentRequest.getName())
                .build();

            Customer customer = Customer.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("customerId", customer.getId());
            response.put("message", "Customer onboarded successfully in test mode.");

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Error onboarding customer: " + e.getMessage());
        }
    }

    public Map<String, Object> createPaymentIntent(PaymentRequest paymentRequest) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(paymentRequest.getAmount()) // Amount in cents
                .setCurrency(paymentRequest.getCurrency())
                .setCustomer(paymentRequest.getCustomerId())
                .setPaymentMethod(paymentRequest.getPaymentMethodId())
                .setConfirm(true)
                .setOffSession(true)
                .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Error creating payment intent: " + e.getMessage());
        }
    }

    public Map<String, Object> saveCard(PaymentRequest paymentRequest) throws StripeException {
      // Check if payment method ID and customer ID are provided
      if (paymentRequest.getPaymentMethodId() == null || paymentRequest.getCustomerId() == null) {
          throw new IllegalArgumentException("PaymentMethodId and CustomerId are required");
      }
  
      // Attach the payment method (card) to the customer
      Map<String, Object> params = new HashMap<>();
      params.put("customer", paymentRequest.getCustomerId());
  
      com.stripe.model.PaymentMethod paymentMethod = com.stripe.model.PaymentMethod.retrieve(paymentRequest.getPaymentMethodId());
      paymentMethod.attach(params);
  
      // Optionally, set the attached payment method as the default for the customer
      com.stripe.model.Customer customer = com.stripe.model.Customer.retrieve(paymentRequest.getCustomerId());
      Map<String, Object> updateParams = new HashMap<>();
      updateParams.put("invoice_settings", Map.of("default_payment_method", paymentRequest.getPaymentMethodId()));
      customer.update(updateParams);
  
      // Return confirmation response
      Map<String, Object> responseData = new HashMap<>();
      responseData.put("message", "Card saved successfully and set as default");
      return responseData;
  }
  
}