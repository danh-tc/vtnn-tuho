package com.rethink_never_ends.vtnn_tuho_apis.modules.product.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("products")
public class ProductController {
    @GetMapping
    public String sayHello() {
        return "Hellow Be Danh cute hehe ahaha";
    }
}
