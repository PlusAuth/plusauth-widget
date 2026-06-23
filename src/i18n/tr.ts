export default {
  $locale: 'Türkçe',
  common: {
    allow: 'İzin Ver',
    code: 'kod',
    continue: 'Devam Et',
    days: 'gün',
    downloadAuthPlus: '{0} uygulamasını uygulama mağazanızdan indirebilirsiniz',
    edit: 'Düzenle',
    email: 'e-posta',
    enterOtp: '@:common.code giriniz',
    field: 'Alan',
    user: 'Kullanıcı',
    fields: {
      code: 'Kod',
      email: 'E-posta',
      newPassword: 'Yeni Şifre',
      password: 'Şifre',
      phone_number: 'Telefon numarası',
      rePassword: 'Şifre onayı',
      username: 'Kullanıcı Adı'
    },
    hide: 'Gizle',
    hours: 'saat',
    minutes: 'dakika',
    notification: 'bildirim',
    reject: 'Reddet',
    resend: 'Tekrar Gönder',
    resendText: '{type} ulaşmadı mı?',
    resendAfter: 'Tekrar gönderim süresi: {time}',
    seconds: 'saniye',
    show: 'Göster',
    submit: 'Gönder',
    verify: 'Doğrula',
    years: 'yıl',
    usePassword: 'Bunun yerine şifrenizi kullanın'
  },
  verifyEmail: {
    title: '@:common.email Adresinizi Kontrol Edin',
    checkText: '<strong>{email}</strong> adresine bir e-posta gönderdik, lütfen @:common.email adresinizi doğrulamak için ilgili bağlantıya tıklayın.',
    successTitle: 'E-posta adresiniz başarıyla doğrulandı.',
    redirectingText: ' {time} saniye içinde uygulamaya yönlendiriliyorsunuz.',
    emailType: '@:common.email'
  },
  consent: {
    allow: '@:common.allow',
    reject: '@:common.reject',
    title: '{clientName} aşağıdakiler için izninizi istiyor',
    groups: {
      base: 'Temel Özellikler',
      claims: 'Talepler/Haklar'
    }
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
      '0x3001004': 'Şablon sayısı sıfırdan büyük olmalıdır',
      '0x3001005': 'Şifreleme hatası',
      '0x3001006': 'Dahili hata',
      '0x3000006': 'Parmak yerleşimi doğru değil',
      '0x300000e': 'Parmak eşleşmedi',
      '0x2000011': 'Cihaz bağlantısı kesildi',
      '0x02000011': 'Cihaz bağlantısı kesildi',
      '0x02000021': 'Cihaz bağlantısı kesildi',
      '0x03000001': 'Tarayıcı cihaz bulunamadı',
      '0x03000002': 'Geçersiz BIR formatı',
      '0x03000003': 'Base64 kodlama başarısız',
      '0x03000004': 'Geçersiz BIR çıkış parametresi',
      '0x03000005': 'Doğrulama çekimi eşleşme için yeterince yakın değildi',
      '0x03000006': 'Parmak yakalama tutarlılık kontrolü başarısız',
      '0x03000007': 'Çok fazla deneme yapıldı',
      '0x03000008': 'Tarayıcı hatası: geçersiz parametre',
      '0x03000009': 'Genel tarayıcı hatası',
      '0x0300000A': 'Tarayıcı hatası: eşleşme başarısız',
      '0x0300000B': 'Doğrulanacak şablon bulunamadı',
      '0x0300000C': 'Cihaz tespit edilemedi',
      '0x0300000D': 'Dahili yeterli bellek ayrılamadı',
      '0x0300000E': 'Parmak doğrulaması eşleşmiyor',
      '0x0300000F': 'Parmak tanımlama: eşleşme bulunamadı',
      '0x03000010': 'Parmak tanımlama: birden fazla eşleşme bulundu',
    },
    webauthn: {
      not_supported: "Tarayıcınız WebAuthN API'sini desteklemiyor gibi görünüyor. Tarayıcınızı güncellemeyi veya desteklenen bir tarayıcı kullanmayı deneyin.",
      operation_failed: 'İşlem hata ile başarısız oldu:'
    },
    already_exists: '@:common.user zaten mevcut',
    code_already_used: '@:common.code zaten kullanılmış',
    code_expired: '@:common.code süresi dolmuş',
    email_not_verified: '@:common.email doğrulanmadı. Lütfen @:common.email hesabınıza gönderilen bağlantıya tıklayarak @:common.email adresinizi doğrulayın.',
    invalid_entity: 'Geçersiz {field}',
    field_required: '{field} gereklidir.',
    incorrect_code: 'Doğrulama @:common.code geçersiz',
    invalid_code: '@:common.code geçersiz',
    invalid_credentials: 'Geçersiz @:login.signIn bilgileri. Lütfen tekrar deneyin.',
    invalid_password: 'Geçersiz @:common.fields.password girildi.',
    passwords_not_match: 'Şifreler eşleşmiyor',
    user_not_found: '@:common.user bulunamadı',
    weak_password: '@:common.fields.password çok zayıf',
    too_many_requests: 'Çok hızlı deniyorsunuz. {retry} sonra tekrar deneyin.',
    account_blocked: 'Hesabınız bloke edildi. Lütfen daha fazla talimat için @:common.email adresinizi kontrol edin veya bir yönetici ile iletişime geçin.',
    old_password: 'Daha önce kullandığınız bir @:common.fields.password kullanmaya çalışıyorsunuz. Güvenliğiniz için lütfen geçmişte kullanmadığınız yeni bir @:common.fields.password seçin.'
  },
  fillMissing: {
    title: 'Eksik bilgileri doldurun',
    subtitle: 'İşleme devam etmek için lütfen gereken ek bilgileri doldurun.',
    fieldLabel: 'common.fields.{0}',
    fieldRequiredError: '@:errors.field_required',
    submitAction: '@:common.submit'
  },
  forgotPassword: {
    title: '@:common.fields.password sıfırlama',
    subtitle: '@:common.fields.password sıfırlama talebinde bulunmak için lütfen @:common.email adresinizi girin',
    emailSent: 'Eğer <strong>{email}</strong> adresiyle ilişkili bir hesap varsa, @:common.fields.password sıfırlama bağlantısı içeren bir @:common.email alacaksınız.',
    emailLabel: '@:common.fields.email',
    submitAction: '@:common.submit',
    userNotFoundError: '@:errors.user_not_found'
  },
  login: {
    title: 'Giriş Yap',
    signIn: 'Giriş Yap',
    signInWith: '{0} ile giriş yap',
    socialLoginHelper: 'veya',
    noAccount: 'Hesabınız yok mu?',
    signUp: 'Kayıt Ol',
    forgotPassword: 'Şifremi Unuttum',
    emailLabel: '@:common.fields.email',
    phoneLabel: '@:common.fields.phone_number',
    passwordLabel: '@:common.fields.password',
    userNotFoundError: '@:errors.user_not_found',
    invalidPasswordError: '@:errors.invalid_password'
  },
  accountLinking: {
    title: 'Hesap Bağlama',
    description: '@:common.email adresinizle zaten ilişkili bir hesap olduğu görünüyor. Devam etmek için lütfen sahipliğinizi doğrulayın.',
    passwordLabel: '@:common.fields.password',
    continueAction: '@:common.continue',
    submitAction: '@:common.submit',
    userNotFoundError: '@:errors.user_not_found',
    invalidPasswordError: '@:errors.invalid_password'
  },
  passwordless: {
    challenge: {
      title: 'Aşağıdaki yöntemlerden birini seçin',
    },
    useAnotherMethod: 'Başka bir yöntemle giriş yap',
    email: {
      title: '<strong>{email}</strong> adresine gönderilen yetkilendirme @:common.code giriniz',
      magicLinkTitle: '@:common.email adresinizi kontrol edin',
      checkText: '<strong>{email}</strong> adresine bir @:common.email gönderdik, giriş yapmak için lütfen ilgili bağlantıya tıklayın. Bağlantıyı giriş yapmaya çalıştığınız cihazda/tarayıcıda açtığınızdan emin olun.',
      codeLabel: '@:common.fields.code',
      submitAction: '@:common.submit',
      useAnotherMethod: 'Başka bir yöntemle giriş yap',
      invalidCodeError: '@:errors.invalid_code',
      emailType: '@:common.email'
    },
    otp: {
      title: 'Yetkilendirme @:common.code giriniz',
      registerTitle: 'Doğrulayıcınızı Kaydedin',
      registerSubtitle: 'Tercih ettiğiniz doğrulayıcı uygulamayı açın ve aşağıdaki QR kodu taratın. Eğer @:common.code taratırken sorun yaşıyorsanız, görselin altındaki @:common.code manuel olarak girebilirsiniz.',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod'
    },
    sms: {
      title: '<strong>{phone_number}</strong> numarasına gönderilen yetkilendirme @:common.code giriniz',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod',
      codeType: '@:common.code'
    },
    push: {
      enrollTitle: 'Cihazınızı kaydedin',
      enrollDescription: 'Aşağıdaki QR @:common.code {0} uygulamanızla taratın',
      title: 'Cihazınızı kontrol edin',
      selectCode: 'Cihazınızdan aşağıdaki numarayı seçin',
      description: 'Erişime izin vermek için cihazınızdaki @:common.notification tıklayın',
      otpTitle: '@:mfa.otp.title',
      otpLabel: '@:common.enterOtp',
      waitingApproval: '@:mfa.challenge.waitingApproval',
      submitAction: '@:common.submit',
      continueAction: '@:common.continue',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod',
      tryCodeAction: '@:common.code manuel olarak girmeyi deneyin',
      notificationType: '@:common.notification',
      invalidCodeError: '@:errors.invalid_code'
    },
    webauthn: {
      title: 'Geçiş anahtarınızı (passkey) kullanmak için @:common.continue tıklayın',
      verifying: 'Kimlik bilgileriniz doğrulanıyor...',
      continueAction: '@:common.continue',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod',
      notSupportedError: '@:errors.webauthn.not_supported',
      operationFailedError: '@:errors.webauthn.operation_failed'
    },
    pw: {
      choice: '@:common.fields.password ile devam et'
    }
  },
  mfa: {
    challenge: {
      email: '@:common.email',
      fv: 'Parmak Damar İzi',
      webauthn: 'Güvenlik Anahtarı veya Cihaz',
      sc: 'Akıllı Kart/E-İmza',
      otp: 'Doğrulama Uygulaması',
      sms: 'SMS',
      title: 'Aşağıdaki yöntemlerden birini seçin',
      waitingApproval: 'Cihazınızda onay bekleniyor…'
    },
    email: {
      title: '<strong>{email}</strong> adresine gönderilen yetkilendirme @:common.code giriniz',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay',
      emailType: '@:common.email'
    },
    fv: {
      checkingDevice: 'Cihaz bağlantısı kontrol ediliyor',
      enrollmentInProgress: 'Kayıt işlemi devam ediyor',
      saving: 'Kayıtlar kaydediliyor',
      verifyInProgress: '@:common.verify işlemi devam ediyor',
      enroll: 'Kaydetmek için bir parmak seçin. Birden fazla parmak kaydedebilirsiniz.',
      checkDevice: 'Cihazınızın bağlı olduğundan ve gerekli yazılımın yüklü olduğundan emin olun. Cihaz hazır olduğunda bu sayfayı yenileyin.',
      verify: 'Parmağınızı taramaya hazır olduğunuzda <strong>@:common.verify</strong> butonuna tıklayın.',
      fingerEnrolledSuccess: 'Parmak Kaydedildi',
      enrollRequiredError: '@:errors.fv.enrollRequired',
      submitAction: '@:common.submit',
      verifyAction: '@:common.verify',
      tryAnotherWay: '@:mfa.tryAnotherWay'
    },
    otp: {
      title: 'Yetkilendirme @:common.code giriniz',
      registerTitle: 'Doğrulayıcınızı Kaydedin',
      registerSubtitle: 'Tercih ettiğiniz doğrulayıcı uygulamayı açın ve aşağıdaki QR kodu taratın. @:common.code taratırken sorun yaşıyorsanız, görselin altındaki @:common.code manuel olarak girebilirsiniz.',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay'
    },
    push: {
      enrollTitle: 'Cihazınızı kaydedin',
      enrollDescription: 'Aşağıdaki QR @:common.code {0} uygulamanızla taratın',
      title: 'Cihazınızı kontrol edin',
      selectCode: 'Cihazınızdan aşağıdaki numarayı seçin',
      description: 'Erişime izin vermek için cihazınızdaki @:common.notification tıklayın',
      otpTitle: '@:mfa.otp.title',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      continueAction: '@:common.continue',
      tryAnotherWay: '@:mfa.tryAnotherWay',
      tryCodeAction: '@:common.code manuel olarak girmeyi deneyin',
      notificationType: '@:common.notification'
    },
    sms: {
      title: '<strong>{phone_number}</strong> numarasına gönderilen yetkilendirme @:common.code giriniz',
      codeLabel: '@:common.fields.code',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay'
    },
    webauthn: {
      title: 'Geçiş anahtarınızı kullanmak için @:common.continue tıklayın',
      verifying: 'Kimlik bilgileriniz doğrulanıyor...',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay',
      notSupportedError: '@:errors.webauthn.not_supported',
      operationFailedError: '@:errors.webauthn.operation_failed'
    },
    tryAnotherWay: 'Başka bir yol dene'
  },
  passwordPolicy: {
    customChars: 'En az bir adet {0}',
    customRegexp: '',
    lowerCase: 'En az {0} küçük harf',
    max: 'Maksimum {0} karakter',
    min: 'Minimum {0} karakter',
    number: 'En az {0} rakam',
    upperCase: 'En az {0} büyük harf'
  },
  passwordChallenge: {
    title: '@:login.title',
    passwordLabel: '@:common.fields.password',
    continueAction: '@:common.continue',
    forgotPassword: '@:login.forgotPassword',
    userNotFoundError: '@:errors.user_not_found',
    invalidPasswordError: '@:errors.invalid_password'
  },
  register: {
    haveAccount: 'Hesabınız var mı?',
    title: 'Kayıt Ol',
    signIn: '@:login.signIn',
    signUp: '@:login.signUp',
    signUpWith: '{0} ile Kayıt Ol',
    socialLoginHelper: '@:login.socialLoginHelper',
    emailLabel: '@:common.fields.email',
    phoneLabel: '@:common.fields.phone_number',
    passwordLabel: '@:common.fields.password',
    rePasswordLabel: '@:common.fields.rePassword',
    passwordMismatchError: '@:errors.passwords_not_match',
    alreadyExistsError: '@:errors.already_exists',
    forgotPassword: '@:login.forgotPassword'
  },
  resetPassword: {
    title: '@:common.fields.password Sıfırla',
    successfullyReset: '@:common.fields.password başarıyla sıfırlandı.',
    newPasswordLabel: '@:common.fields.newPassword',
    rePasswordLabel: '@:common.fields.rePassword',
    passwordMismatchError: '@:errors.passwords_not_match',
    submitAction: '@:common.submit'
  },
}