# Belirsizlikleri Netleştirme ve Soru Listesi

Proje başlangıcında ve geliştirme sürecinde müşteri ile yapılan görüşmelerde sorulan sorular ve alınan yanıtlar aşağıda listelenmiştir.

 **1.)Müşteri kaydı olmadan sipariş verilebilir mi?**  Evet, misafir (guest) checkout desteği olmalı. Ancak iletişim bilgileri siparişte tutulmalı.  Uygulandı 
**2.))Aynı telefon numarasıyla birden fazla kayıt olabilir mi?** Hayır, telefon numarası sistemde tekil (unique) anahtar olmalı. Uygulandı
**3.)E-posta adresi zorunlu mu? | Hayır, e-posta opsiyoneldir ancak girilirse formatı doğrulanmalıdır.** Uygulandı
 **4.)Stok takibi her ürün için zorunlu mu? | Hayır, bazı ürünler (örn: dijital hizmetler) için stok takibi kapatılabilmeli.** Uygulandı 
**5.)Müşteri silindiğinde geçmiş siparişleri ne olmalı?** Müşteri "soft-delete" ile pasife alınmalı, sipariş geçmişi veri bütünlüğü için korunmalı.Uygulandı 
**6.)Ürün fiyatları değiştiğinde eski siparişler etkilenmeli mi?** Hayır, sipariş anındaki birim fiyat `OrderItems` tablosunda saklanmalı. Uygulandı

## Netleştirilen Teknik Detaylar
1. **Veri Temizliği:** CSV'den gelen tırnak işaretli ve hatalı formatlı verilerin otomatik temizlenmesine karar verildi.
2. **İzlenebilirlik:** Hata ayıklama süreçleri için her isteğe bir `Trace-ID` atanması kararlaştırıldı.
3. **API Dokümantasyonu:** Teknik olmayan paydaşların da test edebilmesi için Swagger UI kullanılmasına karar verildi.
