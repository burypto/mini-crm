# Gereksinim Analizi ve Mimari Tasarım Dokümanı

## 1. Gereksinim Analizi

### Müşteri Talepleri ve Çözümler

- **Soyadı Olmayan Müşteriler:** Sistem soyadı bilgisini opsiyonel (`allowNull: true`) olarak kabul eder.
- **Mükerrer Kayıtlar:** Aynı isimde farklı kişiler olabilir. Sistemde **Telefon Numarası** tekil (`unique`) anahtar olarak belirlenmiştir; e-posta adresi ise serbest bırakılmıştır.
- **Adres Bilgisi:** Üyelik aşamasında adres opsiyoneldir. Ancak sipariş aşamasında kargo için adres girişi zorunlu tutulmuştur.
- **Sipariş ve Stok:** Stok takibi yapılmayan ürünler için `trackStock: false` bayrağı eklenmiştir. Stokta olmayan ürünler için sipariş oluşturulurken uyarı/hata mekanizması kurgulanmıştır.
- **Müşterisiz Sipariş (Karar):** Müşterinin "Müşteri yoksa da sipariş verilebilmeli" talebi, veri bütünlüğü ve CRM mantığı gereği **"Hızlı Kayıt"** yöntemiyle çözülmüştür. Sistemde tamamen sahipsiz bir sipariş tutmak yerine, sipariş anında sadece isim/telefon alınarak arka planda bir müşteri kaydı oluşturulur. Bu sayede hem müşterinin hızı kesilmez hem de CRM'in "müşteri geçmişi" takibi bozulmaz. Teknik olarak `customerId` alanı zorunlu kalmaya devam eder ancak API seviyesinde `guestCheckout` desteği sunulabilir.

## 2. Mimari Tasarım

### UML Diyagramları

#### Use Case Diyagramı

\`\`\`mermaid
useCaseDiagram
actor "Yönetici" as Admin
actor "Müşteri" as Customer

    Admin --> (Müşteri Yönetimi)
    Admin --> (Ürün/Stok Yönetimi)
    Admin --> (Sipariş Takibi)
    Customer --> (Sipariş Oluşturma)
    (Sipariş Oluşturma) ..> (Stok Kontrolü) : <<include>>

\`\`\`

#### Class Diyagramı

\`\`\`mermaid
classDiagram
Customer "1" -- "_" Order
Order "1" -- "_" OrderItem
Product "1" -- "\*" OrderItem

    class Customer {
        +String firstName
        +String lastName
        +String email
        +String phone
        +softDelete()
    }

    class Order {
        +Integer customerId
        +String status
        +Decimal totalAmount
        +calculateTotal()
    }

    class Product {
        +String name
        +String sku
        +Integer stockQuantity
        +Boolean trackStock
    }

\`\`\`

### Veritabanı Şeması (ERD Özeti)

- **Customers:** id, first_name, last_name, phone, email, address, is_active
- **Products:** id, name, sku, price, stock_quantity, track_stock
- **Orders:** id, customer_id, status, total_amount
- **OrderItems:** id, order_id, product_id, quantity, unit_price

### Modüller ve Servisler

- **CustomerService:** Müşteri CRUD ve doğrulama işlemleri yapılır.
- **OrderService:** Sipariş oluşturma, stok kontrolü ve kalem hesaplamaları yapılır.
- **Gelişmiş ETL ve Veri Temizliği (Tuzak Çözümleri):** 
    - **Tırnak Temizliği:** CSV verilerindeki `"""Merve"""` gibi hatalı tırnak kullanımları Regex (`/['"“”„‟]+/g`) ile temizlenerek veritabanı tutarlılığı sağlanmıştır.
    - **E-Posta Doğrulaması:** `ceren@@mail.com` veya `ayse.kara@mail` gibi bozuk e-posta formatlarını ayıklayan RFC standartlarına uygun Regex kontrolü eklenmiştir.
    - **Telefon Normalizasyonu:** Farklı formatlardaki (+90, 05xx, 5xx) tüm numaralar `905xx` standardına normalize edilmektedir.
- **Esnek Veritabanı Şeması:** Müşteri talepleri doğrultusunda, `Order` tablosundaki `customer_id` alanı `allowNull: true` olarak güncellenerek "Müşterisiz Sipariş" (Guest Checkout) desteği veritabanı seviyesinde garanti altına alınmıştır.
- **Performans Optimizasyonu:** `phone`, `email` ve `sku` alanlarına veritabanı seviyesinde Index eklenerek sorgu hızları artırılmıştır.
- **Güvenli Konfigürasyon:** Hassas veriler (bağlantı ayarları vb.) `.env` dosyasında tutulmaktadır.

### Loglama ve İzlenebilirlik

- **Trace ID:** Her isteğe özel UUID atanarak loglar arasında takip sağlanır.
- **Winston:** Seviyeli loglama (info, warn, error) ve JSON formatında çıktı.



## 3. API Uçları

- `GET /api/customers`: Müşteri listesi
- `POST /api/customers`: Yeni müşteri
- `GET /api/orders`: Sipariş listesi
- `POST /api/orders`: Yeni sipariş (Stok kontrollü)
- `PATCH /api/orders/:id/status`: Sipariş durumu güncelleme (`Sipariş Verildi`, `Ödeme Alındı`, `Hazırlanıyor`, `Kargoya Verildi`, `Teslim Edildi`)
