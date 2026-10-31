from django.db import models
from django.conf import settings
from apps.shops.models import Shop
from apps.users.models import Address
from apps.catalog.models import Product, ProductVariant


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.SET_NULL)
    qty = models.PositiveIntegerField(default=1)


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending'; ACCEPTED = 'accepted'; PREPARING = 'preparing'
        PACKING = 'packing'; DELIVERING = 'delivering'; DELIVERED = 'delivered'
        CANCELED = 'canceled'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    shop = models.ForeignKey(Shop, on_delete=models.PROTECT)
    address = models.ForeignKey(Address, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment = models.CharField(max_length=20, default='card')
    comment = models.TextField(blank=True)
    delivery_date = models.DateField()
    delivery_time = models.TimeField()
    postcard_text = models.TextField(blank=True)
    bonus_used = models.PositiveIntegerField(default=0)
    bonus_earned = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_snapshot = models.JSONField()
    variant_snapshot = models.JSONField(null=True, blank=True)
    qty = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)