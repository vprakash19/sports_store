package com.example.sports_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long variantId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "sku", nullable = false)
    private String sku;

    @Column(name = "size_label")
    private String sizeLabel;

    @Column(name = "color")
    private String color;

    @Column(name = "price", nullable = false)
    private java.math.BigDecimal price;

    @Column(name = "discount_price")
    private java.math.BigDecimal discountPrice;

    public ProductVariant() {
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getSizeLabel() {
        return sizeLabel;
    }

    public void setSizeLabel(String sizeLabel) {
        this.sizeLabel = sizeLabel;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public java.math.BigDecimal getPrice() {
        return price;
    }

    public void setPrice(java.math.BigDecimal price) {
        this.price = price;
    }

    public java.math.BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(java.math.BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }
}
