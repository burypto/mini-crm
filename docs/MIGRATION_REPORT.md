# Veritabanı Migration Raporu

Bu rapor, projenin geliştirilme sürecinde veritabanı şemasında yapılan değişiklikleri ve uygulanan migration adımlarını özetler.

## 1. Mevcut Tablo Yapısı ve Değişiklikler

### Customers Tablosu

- **Başlangıç:** Sadece temel alanlar mevcuttu ve bu alanlarda hatalı kayıtlar vardı.
- **Güncelleme:** `email` ve `phone` alanları için `unique` kısıtı eklendi. `is_active` alanı ile soft-delete mekanizması kuruldu.
- **İndeksler:** `email` ve `phone` alanları üzerinde hızlı arama için indeksler oluşturuldu.

### Products Tablosu 

- **Açıklama:** Stok ve fiyat takibi için sıfırdan oluşturuldu.
- **Alanlar:** `id`, `name`, `sku` (unique), `price`, `stock_quantity`, `track_stock`.

### Orders Tablosu

- **Başlangıç:** Sadece `customer_id` ve `total_amount` alanları vardı.
- **Güncelleme:** `status` alanı için varsayılan değerler (`pending`, `preparing`, `shipped`, `delivered`) belirlendi. `customer_id` için `Foreign Key` kısıtı ve `CASCADE` kuralları eklendi.

### OrderItems Tablosu

- **Açıklama:** Siparişlerin içindeki ürün detaylarını tutmak için oluşturuldu.
- **Alanlar:** `id`, `order_id`, `product_id`, `quantity`, `unit_price`.

## 2. Migration Dosyaları

1. `20240101000000-create-customer.js`: Müşteri tablosunun oluşturulması.
2. `20240102000000-create-order.js`: Sipariş tablosunun oluşturulması ve müşteri ilişkisi.
3. `20240103000000-create-products-and-items.js`: Ürün ve sipariş kalemleri tablolarının oluşturulması.

### 3. Veri Tutarlılığı Kararları
- Sipariş silindiğinde sipariş kalemleri de silinir (`ON DELETE CASCADE`).
- Bir ürüne ait sipariş varsa, o ürünün silinmesi engellenir (`ON DELETE RESTRICT`).
- Müşteri silindiğinde (soft-delete hariç) siparişlerin geçmişi korunur.
- **Misafir Siparişi:** `customerId` gönderilmediğinde sistem otomatik olarak `isActive: false` olan bir müşteri kaydı oluşturur ve siparişi bu ID ile ilişkilendirir. Bu sayede veritabanı bütünlüğü (Foreign Key) korunurken kullanıcıya "müşterisiz sipariş" deneyimi sunulur.
