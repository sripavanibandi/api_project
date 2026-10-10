package com.example.order_service.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    @Around("execution(* com.example.order_service.service..*(..))")
    public Object logExecution(ProceedingJoinPoint joinPoint) throws Throwable {

        String methodName = joinPoint.getSignature().toShortString();

        System.out.println("Entering: " + methodName);

        try {
            Object result = joinPoint.proceed();

            System.out.println("Exiting: " + methodName);

            return result;

        } catch (Exception e) {

            System.out.println(
                    "Exception in " + methodName + ": " + e.getMessage());

            throw e;
        }
    }
}