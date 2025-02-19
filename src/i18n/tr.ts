export default {
  common: {
    allow: 'İzin Ver',
    code: 'Kod',
    continue: 'Devam Et',
    days: 'gün',
    downloadAuthPlus: 'Market uygulamanızdan {0}\'ı indirebilirsiniz.',
    edit: 'Düzenle',
    email: 'E-posta',
    enterOtp: 'Kodunuzu girin',
    field: 'Alan',
    fields: {
      code: 'Kod',
      email: 'E-posta',
      newPassword: 'Yeni Şifre',
      password: 'Şifre',
      phone_number: 'Telefon numarası',
      rePassword: 'Şifre onayı',
      username: 'Kullanıcı adı'
    },
    hide: 'Gizle',
    hours: 'saat',
    minutes: 'dakika',
    notification: 'Bildirim',
    reject: 'Reddet',
    resend: 'Tekrar Gönder',
    resendText: '{type} almadınız mı?',
    resendAfter: 'Tekrar gönder: {time}',
    seconds: 'saniye',
    show: 'Göster',
    submit: 'Gönder',
    verify: 'Doğrula',
    years: 'yıl'
  },
  verifyEmail: {
    checkText: '<strong>{email}</strong> adresine bir e-posta gönderdik, lütfen e-posta adresinizi doğrulamak için içindeki bağlantıya tıklayın.',
    title: 'E-postanızı Kontrol Edin'
  },
  consent: {
    allow: 'İzin Ver',
    reject: 'Reddet',
    title: '{clientName}, aşağıdakiler için onayınızı istiyor'
  },
  errors: {
    fv: {
      'enrollRequired': 'En az bir parmak kaydetmelisiniz',
      '9999': 'Geçersiz istek',
      '0x100010e': 'Yakalama zaman aşımı',
      '0x1000118': 'Yakalama iptal edildi',
      '0x3001001': 'Cihaz başlatılamadı',
      '0x3001002': 'Geçersiz lisans',
      '0x3001003': 'Geçersiz parametreler',
      '0x3001004': 'Şablon sayısı sıfırdan fazla olmalıdır',
      '0x3001005': 'Şifreleme hatası',
      '0x3001006': 'Dahili hata',
      '0x3000006': 'Parmak yerleştirme doğru değil',
      '0x300000e': 'Parmak eşleşmedi',
      '0x2000011': 'Cihaz bağlantısı kesildi',
      '0x02000011': 'Cihaz bağlantısı kesildi',
      '0x02000021': 'Cihaz bağlantısı kesildi',
      '0x03000001': 'Tarayıcı cihazı bulunamadı',
      '0x03000002': 'Geçersiz BIR formatı',
      '0x03000003': 'Base64 kodlama başarısız',
      '0x03000004': 'Geçersiz BIR çıkış parametresi',
      '0x03000005': 'Doğrulama yakalama eşleşecek kadar yakın değil',
      '0x03000006': 'Parmak yakalama tutarlılık kontrolü başarısız oldu',
      '0x03000007': 'Çok fazla tekrar denendi',
      '0x03000008': 'Geçersiz parametre',
      '0x03000009': 'Genel tarayıcı hatası',
      '0x0300000A': 'Eşleşme başarısız',
      '0x0300000B': 'Doğrulama için şablon yok',
      '0x0300000C': 'Cihaz algılanmadı',
      '0x0300000D': 'Dahili yeterli bellek ayrılamadı',
      '0x0300000E': 'Parmak doğrulama eşleşmedi',
      '0x0300000F': 'Parmak tanımlamada eşleşme bulunamadı',
      '0x03000010': 'Parmak tanımlamada birden fazla eşleşme'
    },
    webauthn: {
      not_supported: 'Tarayıcınız WebAuthN API’sini desteklemiyor gibi görünüyor. Tarayıcınızı güncellemeyi deneyin veya desteklenen bir tarayıcı kullanın.',
      operation_failed: 'İşlem hata ile başarısız oldu:'
    },
    already_exists: 'Kullanıcı zaten mevcut',
    code_already_used: 'Kod zaten kullanılmış',
    code_expired: 'Kodun süresi doldu',
    email_not_verified: 'E-posta doğrulanmadı. Lütfen e-posta adresinize gönderilen bağlantıya tıklayarak e-postanızı doğrulayın.',
    invalid_entity: 'Geçersiz {field}',
    field_required: '{field} gerekli.',
    incorrect_code: 'Doğrulama kodu geçersiz',
    invalid_code: 'Kod geçersiz',
    invalid_credentials: 'Geçersiz giriş bilgileri. Lütfen tekrar deneyin.',
    invalid_password: 'Geçersiz şifre sağlandı.',
    passwords_not_match: 'Şifreler eşleşmiyor',
    user_not_found: 'Kullanıcı bulunamadı',
    weak_password: 'Şifre çok zayıf',
    too_many_requests: 'Çok hızlı deniyorsunuz. Lütfen {retry} sonra tekrar deneyin.',
    account_blocked: 'Hesabınız engellendi. Daha fazla talimat için e-postanızı kontrol edin veya bir yönetici ile iletişime geçin.',
    old_password: 'Daha önce kullandığınız bir şifreyi kullanıyor olabilirsiniz. Güvenliğiniz için, geçmişte kullanmadığınız yeni bir şifre seçin.'
  },
  fillMissing: {
    title: 'Eksik bilgileri doldurun',
    subtitle: 'Uygulamaya devam etmek için gerekli ek bilgileri doldurun.'
  },
  forgotPassword: {
    emailSent: '<strong>{email}</strong> adresine bir hesap varsa, şifrenizi sıfırlamanız için bir bağlantı içeren bir e-posta alacaksınız.',
    subtitle: 'Şifre sıfırlama talebinde bulunmak için e-posta adresinizi girin',
    title: 'Şifrenizi sıfırlayın'
  },
  login: {
    forgotPassword: 'Şifrenizi mi unuttunuz',
    noAccount: 'Hesabınız yok mu?',
    title: 'Giriş Yap',
    signIn: 'Giriş Yap',
    signInWith: '{0} ile giriş yap',
    socialLoginHelper: 'veya',
    signUp: 'Kayıt Ol'
  },
  accountLinking: {
    title: 'Hesabı Bağla',
    description: 'Görünüşe göre e-posta adresinizle zaten bir hesap ilişkilendirilmiş. Devam etmek için mülkiyeti doğrulayın.'
  },
  passwordless: {
    email: {
      magicLinkTitle: 'E-postanızı Kontrol Edin',
      title: 'Gönderilen doğrulama kodunu girin: <strong>{email}</strong>',
      checkText: '<strong>{email}</strong> adresine bir e-posta gönderdik, içindeki bağlantıya tıklayarak giriş yapabilirsiniz. Giriş yapmaya çalıştığınız cihaz/tarayıcıda bağlantıyı açtığınızdan emin olun.'
    },
    otp: {
      registerTitle: 'Kimlik Doğrulayıcıyı Kaydet',
      registerSubtitle: 'Tercih ettiğiniz kimlik doğrulama uygulamasını açın ve aşağıdaki QR Kodunu tarayın. Kodu taramakta sorun yaşıyorsanız, görüntünün altındaki kodu manuel olarak girebilirsiniz.',
      title: 'Doğrulama kodunu girin'
    },
    sms: {
      title: 'Gönderilen doğrulama kodunu girin: <strong>{phone_number}</strong>'
    },
    push: {
      selectCode: 'Cihazınızdan aşağıdaki numarayı seçin',
      title: 'Cihazınızı Kontrol Edin',
      description: 'Erişim izni vermek için cihazınızdaki bildirime tıklayın',
      enrollTitle: 'Cihazınızı Kaydedin',
      enrollDescription: '{0} uygulamanızla aşağıdaki QR Kodunu tarayın',
      tryCodeAction: 'Kodu manuel olarak girmeyi deneyin'
    }
  },
  mfa: {
    challenge: {
      email: 'E-posta',
      fv: 'Parmak Damarı',
      webauthn: 'Güvenlik Anahtarı veya Cihaz',
      sc: 'Akıllı Kart/E-İmza',
      otp: 'Kimlik Doğrulama Uygulaması',
      sms: 'SMS',
      title: 'Aşağıdaki yöntemlerden birini seçin'
    },
    email: {
      title: 'Gönderilen doğrulama kodunu girin: <strong>{email}</strong>'
    },
    fv: {
      enrollmentInProgress: 'Kayıt devam ediyor',
      verifyInProgress: 'Doğrulama devam ediyor',
      saving: 'Kayıtlar kaydediliyor',
      checkingDevice: 'Cihaz bağlantısı kontrol ediliyor',
      checkDevice: 'Cihazınızın bağlı olduğundan ve gerekli yazılımın yüklü olduğundan emin olun. Cihaz hazır olduğunda bu sayfayı yenileyin.',
      enroll: 'Kaydetmek için bir parmak seçin. Birden fazla parmak kaydedebilirsiniz.',
      verify: 'Parmağınızı taramaya hazır olduğunuzda <strong>DOĞRULA</strong> butonuna tıklayın.'
    },
    otp: {
      title: 'Doğrulama kodunu girin',
      registerTitle: 'Kimlik Doğrulayıcıyı Kaydet',
      registerSubtitle: 'Tercih ettiğiniz kimlik doğrulama uygulamasını açın ve aşağıdaki QR Kodunu tarayın. Kodu taramakta sorun yaşıyorsanız, görüntünün altındaki kodu manuel olarak girebilirsiniz.'
    },
    push: {
      selectCode: 'Cihazınızdan aşağıdaki numarayı seçin',
      title: 'Cihazınızı Kontrol Edin',
      description: 'Erişim izni vermek için cihazınızdaki bildirime tıklayın',
      enrollTitle: 'Cihazınızı Kaydedin',
      enrollDescription: '{0} uygulamanızla aşağıdaki QR Kodunu tarayın',
      tryCodeText: 'Bildirim almadınız mı?',
      tryCodeAction: 'Kodu manuel olarak girmeyi deneyin'
    },
    sms: {
      title: 'Gönderilen doğrulama kodunu girin: <strong>{phone_number}</strong>'
    },
    webauthn: {
      verifying: 'Kimlik bilgileriniz doğrulanıyor...'
    },
    tryAnotherWay: 'Başka bir yöntem dene'
  },
  passwordPolicy: {
    customChars: '{0} karakterlerinden en az bir tane',
    customRegexp: '',
    lowerCase: 'En az {0} küçük harf',
    max: 'En fazla {0} karakter',
    min: 'En az {0} karakter',
    number: 'En az {0} sayı',
    upperCase: 'En az {0} büyük harf'
  },
  register: {
    haveAccount: 'Hesabınız var mı?',
    title: 'Kaydol',
    signIn: 'Giriş Yap',
    signUp: 'Kayıt Ol',
    signUpWith: '{0} ile Kaydol'
  },
  resetPassword: {
    successfullyReset: 'Şifreniz başarıyla sıfırlandı.',
    title: 'Şifre Sıfırla'
  }
}
