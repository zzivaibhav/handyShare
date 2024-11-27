package com.g02.handyShare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class HandyShareApplication {
	public static void main(String[] args) {
		SpringApplication.run(HandyShareApplication.class, args);
	}
}
