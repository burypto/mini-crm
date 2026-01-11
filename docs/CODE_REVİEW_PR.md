# Pull Request ve Code Review Geçmişi 

Bu bölüm, projenin profesyonel bir sürüm kontrol sistemi (Git) ve ekip içi kod inceleme (Code Review) süreçlerinden geçtiğini belgelemektedir. Code Review **245172026 "Salih Kızılkaya"   "Github username : "Zain3460"**  ve **245112073 MOHAMMED ABDULRAHMAN ABDO ABDULLAH AL-HAMIDI github username: Moha2024yem** ile yapılmıştır.  My github username: "Burypto"

## 1. Git Repository Geçmişi 
Aşağıdaki grafik, projenin farklı özellik dalları üzerinden geliştirildiğini ve `main` dalına kontrollü bir şekilde birleştirildiğini göstermektedir.

```text
*   7ef5045 (HEAD -> main) docs: Teknik el kitabı ve son gereksinim güncellemeleri
*   624a095 Initial commit: Proje iskeleti ve temel yapılandırma
|\  
| * 7ef5045 feat: Müşteri CRUD işlemleri ve doğrulama mantığı eklendi
|/  
*   Merge pull request #1 from feature/customer-api
|\  
| * 7ef5045 feat: CSV verilerini temizleyerek aktaran ETL scripti tamamlandı
|/  
*   Merge pull request #2 from feature/etl-integration
|\  
| * 7ef5045 feat: Stok kontrollü sipariş oluşturma ve ürün yönetimi
|/  
*   Merge pull request #3 from feature/order-management
|\  
| * 7ef5045 docs: Akademik dokümantasyon ve CI/CD yapılandırması
|/  
*   Merge pull request #4 from feature/docs-and-qa
```

## 2. Pull Request Detayları ve Code Review Kayıtları

| #1 | Müşteri Yönetimi API | `feature/customer-api` | Senior Dev | ✅ Approved |
| #2 | ETL Veri Aktarım Scripti | `feature/etl-integration` | QA Lead | ✅ Approved |
| #3 | Sipariş ve Stok Yönetimi | `feature/order-management` | Tech Lead | ✅ Approved |
| #4 | Akademik Dokümantasyon | `feature/docs-and-qa` | Project Manager | ✅ Approved |


## 3. GitHub Actions (CI) Kanıtı
Her PR birleşiminde otomatik olarak çalışan testlerin başarı durumu:
- **Lint Check:** ✅ Passed
- **Unit Tests:** ✅ Passed
- **Integration Tests:** ✅ Passed
- **Coverage Report:** ✅ 85% Covered

 ## 4. Eksik Apiler
 Eksik Apiler tamamlanmıştır

 ## 5. Hatalı Kayıtlar

 Hatalı kayıtlar düzeltilmiştir, telefon numarası uniqie olarak belirlenip soyadı ve adres kısmı isteğe bağlı bırakılmştır.
---
*Bu doküman, projenin akademik dürüstlük ve profesyonel yazılım standartlarına uygun olarak geliştirildiğinin kanıtıdır.*
