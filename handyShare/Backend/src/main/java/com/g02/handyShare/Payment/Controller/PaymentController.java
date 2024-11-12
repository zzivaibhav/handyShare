package com.g02.handyShare.Payment.Controller;

import com.g02.handyShare.Payment.Request.PaymentRequest;
import com.g02.handyShare.Payment.Service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/all/payment")
@CrossOrigin(origins = "http://172.17.0.99:3000", allowCredentials = "true")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/onboard")
    public ResponseEntity<Map<String, Object>> onboardCustomer(@RequestBody PaymentRequest paymentRequest) {
        Map<String, Object> response = paymentService.onboardCustomer(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/charge")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        Map<String, Object> response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public void handleOptions() {
        // Allow preflight request to pass
    }

    @PostMapping("/save-card")
    public ResponseEntity<Map<String, Object>> saveCard(@RequestBody PaymentRequest paymentRequest) throws Exception {
      Map<String, Object> response = paymentService.saveCard(paymentRequest);
      return ResponseEntity.ok(response);
    }

}