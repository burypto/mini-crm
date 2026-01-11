# Teknik El Kitabı (MiniCRM)

Bu doküman, MiniCRM projesinin teknik mimarisini ve geliştirme standartlarını özetlemektedir.

## 1. Mimari Özet
Proje, **Node.js** ve **Express.js** üzerine kurulu, **Sequelize ORM** ile SQLite veritabanı kullanan katmanlı bir mimariye sahiptir.
- **Routes:** API uç noktaları ve istek karşılama yapıldı.
- **Services:** İş mantığı, stok kontrolleri ve hesaplamalar yapıldı.
- **Models:** Veritabanı şeması ve ilişkilendirildi.
- **Lib:** Loglama, middleware ve yardımcı araçlar kullanıldı.

## 2. Kritik İş Mantığı Kararları
- **Misafir Siparişi:** `customerId` bulunmadığında sistem otomatik olarak pasif bir müşteri kaydı oluşturur.
- **Stok Yönetimi:** Ürün bazlı `trackStock` bayrağı ile esnek stok kontrolü sağlanır.
- **Veri Temizliği:** `"""Merve"""` gibi tırnaklı veriler ve `ceren@@mail.com` gibi hatalı e-postalar Regex ile temizlenir/ayıklanır.
- **Veri Güvenliği:** Telefon numarası tekil anahtar olarak kullanılır; e-posta serbest bırakılmıştır.
- **İzlenebilirlik:** Her istek `Trace-ID` ile işaretlenir ve `statusCode/duration` bazlı loglanır.

## 3. API ve Test Standartları
- **Swagger:** `http://localhost:3000/api-docs` adresinden tüm uçlar test edilebilir.
- **Testler:** Unit (Mock/Stub) ve Entegrasyon testleri ile sağlanmıştır.
- **Linting:** ESLint ve Prettier ile kod standartları korunmaktadır.

## 4. Geliştirme Araçları
- **ETL:** `src/scripts/import_customers_from_csv.js` (Veri temizleme ve aktarım).
- **CI:** GitHub Actions
- **Migration:** Sequelize Migrations.