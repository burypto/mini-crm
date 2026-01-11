# MiniCRM - Müşteri ve Sipariş Yönetim Sistemi

Bu proje, yarım kalmış bir mini CRM / sipariş yönetimi projesinin tamamlanmış teslim sürümüdür.
Müşteri yönetimi, ürün-stok yönetimi, sipariş ve sipariş kalemleri, ETL.

## İçerik
- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [.env Ayarları](#env-ayarları)
- [Migration & Veritabanı](#migration--veritabanı)
- [Çalıştırma](#çalıştırma)
- [Swagger / API Dokümantasyonu](#swagger--api-dokümantasyonu)
- [API Uçları (Özet)](#api-uçları-özet)
- [ETL (CSV Import)](#etl-csv-import)
- [Test](#test)
- [Kod Kalitesi](#kod-kalitesi)
- [Proje Yapısı](#proje-yapısı)
- [Notlar & Bilinen Kısıtlar](#notlar--bilinen-kısıtlar)
- [CI (GitHub Actions)](#ci-github-actions)

---

## Özellikler

- **Müşteri Yönetimi:** Kayıt, güncelleme, soft-delete ve ETL ile toplu aktarım.
- ## Duplicate müşteri kontrolü: ## telefon/benzeri alanlar üzerinden mantıklı kontrol
- **Ürün ve Stok Takibi:** Ürün bazlı stok takibi ve otomatik stok düşme mekanizması.
- **Sipariş Yönetimi:** Stok kontrollü sipariş oluşturma ve durum takibi.
- **Gelişmiş Loglama:** Trace ID desteği ile izlenebilir JSON loglar.
- **Veri Aktarımı (ETL):** Kirli CSV verilerini temizleyerek sisteme aktaran gelişmiş script.

## Ürün & Stok Yönetimi ##
- **Ürün CRUD**
- **Stok görüntüleme ve stok güncelleme**
- **Stok takibi opsiyonel**: Bazı ürünlerde stok takip edilmeyebilir.

## Sipariş Yönetimi ##
- **Sipariş oluşturma / listeleme / detay**
- **Sipariş kalemleri**
- **Müşteri sistemde yoksa sipariş**: misafir (guest) sipariş mantığı
- **Sipariş durumu güncelleme** (“Hazırlanıyor” vb.)

## ETL (Veri Geçişi) ##
- **CSV’den müşteri import**
- **Eksik kolonların bazıları silindi bazıları tolare edildi**
- **Telefon normalizasyonu** (90 harici başlangıçları normalize edildi)**
- **Import raporu üretme** (`import_report.json`)

## Teknolojiler##
- **Node.js + Express**
- **Sequelize ORM**
- **SQLite (vDönüştürüldü)**
- **Jest + Supertest**
- **ESLint + Prettier**
- **Swagger/OpenAPI (Swagger UI)**

## Test & Kalite##
- **Jest + Supertest entegrasyon testleri**
- **Unit test**
- **CI pipeline**
- **Loglama**: traceId + response duration + error log

## Geliştirme Süreci ve PR Geçmişi

Proje, profesyonel yazılım geliştirme yaşam döngüsüne (SDLC) uygun olarak geliştirilmiştir:
- **Feature Branching:** Her özellik (`feature/customer-api`, `feature/order-logic`) ayrı dallarda geliştirilmiştir.
- **Code Review:** Tüm PR'lar (Pull Request) statik kod analizi ve manuel incelemeden geçmiştir.
- **CI/CD:** GitHub Actions üzerinden her push işleminde testler ve lint kontrolleri otomatik çalıştırılmıştır.

## PR Geçmişi##:
1. `PR #1`: Müşteri CRUD ve ETL scripti entegrasyonu.
2. `PR #2`: Stok kontrollü sipariş mantığı ve Transaction yönetimi.
3. `PR #3`: Swagger OpenAPI ve Trace-ID loglama entegrasyonu.
4. `PR #4`: Misafir siparişi (Guest Checkout) desteği ve Ürün API'ları.

## Kurulum

1. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. Veritabanını hazırlayın:

   ```bash
   npx sequelize-cli db:migrate
   ```

3. Örnek verileri aktarın (ETL):

   ```bash
   node src/scripts/import_customers_from_csv.js
   ```

4. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## Testler

Tüm birim ve entegrasyon testlerini çalıştırmak için:

```bash
npm test
```

## Dokümantasyon

Detaylı gereksinim analizi ve mimari tasarım kararları için `GEREKSINIM_VE_MIMARI.md` dosyasını inceleyebilirsiniz.
