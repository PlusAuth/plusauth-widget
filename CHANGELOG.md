# [0.9.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.8.0...v0.9.0) (2020-12-18)


### Features

* redirect to verify email page in case of email not verified ([b5e906f](https://github.com/PlusAuth/plusauth-widget/commit/b5e906fde28c88a0120cd7f6b73c1585cfd6f6d3))

# [0.8.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.7.0...v0.8.0) (2020-12-07)


### Features

* set html of translatable element instead of text ([c18bd9d](https://github.com/PlusAuth/plusauth-widget/commit/c18bd9dfdf8688852505391b9dfb132232284714))
* use new prompt configuration ([c3cc312](https://github.com/PlusAuth/plusauth-widget/commit/c3cc312bdd55ee8a8374d995e3499cf31ace5c9a))

# [0.7.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.5.0...v0.7.0) (2020-12-05)


### Bug Fixes

* assign email not verified error to email field if exists ([098921e](https://github.com/PlusAuth/plusauth-widget/commit/098921e825d2f66be4f564db371b717f0a10b37d))
* error when errors cannot be set when related fields dont exist ([47978c9](https://github.com/PlusAuth/plusauth-widget/commit/47978c95df001ee35e9b9422f5d1d3810c9cb1e2))


### Features

* submit forms on enter ([2319e81](https://github.com/PlusAuth/plusauth-widget/commit/2319e810db5bb7d38e2bf970c652ee6e4a161fbc))


### Performance Improvements

* include popper to vite's optimized dependencies ([5b90eaa](https://github.com/PlusAuth/plusauth-widget/commit/5b90eaab6c49cafee2dbe65eefdffb831e609868))

# [0.5.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.4.0...v0.5.0) (2020-12-02)


### Bug Fixes

* incorrect translation key for reset password ([721dfa2](https://github.com/PlusAuth/plusauth-widget/commit/721dfa285a00bd634149a05b31de4f240a4f3145))
* mode options passed in a case sensitive way ([edf5093](https://github.com/PlusAuth/plusauth-widget/commit/edf5093399b27020d20af296019abc96795f82df))
* wrong missing information body when fields are string ([448a20a](https://github.com/PlusAuth/plusauth-widget/commit/448a20acfc5745dde49019a39078d3a997392a08))
* wrong type for email field in forgot password ([93085cd](https://github.com/PlusAuth/plusauth-widget/commit/93085cd1c63e3f529d256d4738bf43637795e3b4))


### Features

* use fallbacklocale if selected locale is not configured ([d48e6c8](https://github.com/PlusAuth/plusauth-widget/commit/d48e6c8fd22244b81185e36b074ee3292e3d2fb2))

# [0.4.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.3.1...v0.4.0) (2020-11-30)


### Bug Fixes

* `this` is undefined in bound translator function ([4e7d54f](https://github.com/PlusAuth/plusauth-widget/commit/4e7d54f9fa51cba65d2c8f1c08b18989d9671f69))
* error when fields are undefined for generic form ([135257f](https://github.com/PlusAuth/plusauth-widget/commit/135257f6f4fc3ed17ecfbb5fa2238b628d6ba62d))
* focus on select is not lost on click outside ([8c1333f](https://github.com/PlusAuth/plusauth-widget/commit/8c1333f57e4f2d00f145465a11b912bedc091c03))
* language change is not applied ([81b96d0](https://github.com/PlusAuth/plusauth-widget/commit/81b96d09852559b9420051c5ab2dfcbd6a6c82fc))
* progress css is removed from build ([abf8512](https://github.com/PlusAuth/plusauth-widget/commit/abf85121e15ee9d0fb7ffe19bbf4958376389335))
* remove default accept terms checkbox from register page ([26c760d](https://github.com/PlusAuth/plusauth-widget/commit/26c760de2a490b729a956257ec8b1c3786de8327))


### Features

* ability to pass html for i18n values ([ba0fa86](https://github.com/PlusAuth/plusauth-widget/commit/ba0fa86a11e9aaba5d77c9a72a532145e4f8b381))
* apply new styles and generic components ([34bda47](https://github.com/PlusAuth/plusauth-widget/commit/34bda47ed4dd464a194f10b96addda6b109d5b8a))
* bind translator to validator function ([2fa03ee](https://github.com/PlusAuth/plusauth-widget/commit/2fa03eee874b50d0e76e60453a855df3bbe8c82e))
* checkbox component ([d942f75](https://github.com/PlusAuth/plusauth-widget/commit/d942f758773b1547b22dbd70123f7d9ec7d7c128))
* component for generic form ([90b7997](https://github.com/PlusAuth/plusauth-widget/commit/90b7997ad18cf4edcb3086657f6195a60e462521))
* footer component ([21061e4](https://github.com/PlusAuth/plusauth-widget/commit/21061e422c7f14ab2e07d358108f07eb7d630b83))
* insert footer ([3600ffc](https://github.com/PlusAuth/plusauth-widget/commit/3600ffc245b4521cd9db6c1e790fc99b6631852a))
* keep color when checkbox is checked ([1414b3b](https://github.com/PlusAuth/plusauth-widget/commit/1414b3b3a76d5707d2099758d98c3bd698e2366e))
* make selected language reactive ([8153048](https://github.com/PlusAuth/plusauth-widget/commit/8153048f768b8686e1fec0683ed7486fd7e4f07c))
* select component ([6b497f1](https://github.com/PlusAuth/plusauth-widget/commit/6b497f1fd53993d41f062635378d67409b3fa6de))
* use super tiny icons for social icons ([081a420](https://github.com/PlusAuth/plusauth-widget/commit/081a4202d66e5e17103afe6810752a19c77ff647))


### Performance Improvements

* use default slot for messages ([9e4a8e1](https://github.com/PlusAuth/plusauth-widget/commit/9e4a8e169d871c2ecb6bed8dbf73033faa35a004))

## [0.3.1](https://github.com/PlusAuth/plusauth-widget/compare/v0.2.0...v0.3.1) (2020-11-23)


### Bug Fixes

* incorrect component rendered with mode: verifyEmail ([db8a962](https://github.com/PlusAuth/plusauth-widget/commit/db8a962e519c8452a6623397f4e2d77819d1716b))


### Features

* ability to override props in views with `modeOptions` ([a60f7d1](https://github.com/PlusAuth/plusauth-widget/commit/a60f7d154fe0dfdcbee55da9ef117f782568d70b))
* mfa view modes ([234e75a](https://github.com/PlusAuth/plusauth-widget/commit/234e75a4c956f1da171fc48c18dfb89aa00d8c47))
* use static image paths ([6a5f6f8](https://github.com/PlusAuth/plusauth-widget/commit/6a5f6f81956fc01d5d1d7066c276e97effd46a21))
* verify email view ([e5d7c6d](https://github.com/PlusAuth/plusauth-widget/commit/e5d7c6d7fc7c6b00f41870696e5fffaf838cc759))

# [0.2.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.1.1...v0.2.0) (2020-10-20)


### Bug Fixes

* color is not passed to loader inside btn ([6f6c0bc](https://github.com/PlusAuth/plusauth-widget/commit/6f6c0bcd22baca8328eb147a8995f581fbbe44a3))


### Features

* disabled prop for buton component ([843d30d](https://github.com/PlusAuth/plusauth-widget/commit/843d30daf187e8620abaab8aa11dda104d72b111))

## [0.1.1](https://github.com/PlusAuth/plusauth-widget/compare/v0.1.0...v0.1.1) (2020-09-16)


### Features

* prefix all css classes ([0a30e71](https://github.com/PlusAuth/plusauth-widget/commit/0a30e71954c668079dd620cdca7b92646267640c))

# [0.1.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.2...v0.1.0) (2020-09-16)


### Bug Fixes

* consent screen crashes when no scopes exists in context ([e020814](https://github.com/PlusAuth/plusauth-widget/commit/e020814ddaedade30002368443b7629acb1ef03f))
* lazyvalue typing error in validatable mixin ([8108dfc](https://github.com/PlusAuth/plusauth-widget/commit/8108dfc81b18391ace4e9def065d5348b69b6d8b))


### Features

* add flat prop and textColor to button component ([9c7dfbf](https://github.com/PlusAuth/plusauth-widget/commit/9c7dfbfe1b78d32489b27783135ee2ab2a551326))
* add textColor to colorable mixin ([96c5150](https://github.com/PlusAuth/plusauth-widget/commit/96c5150fac0d3f3c8da7a84172222510b2065fb8))
* add title for otp code screen ([358f1d7](https://github.com/PlusAuth/plusauth-widget/commit/358f1d791a6280e4b6138b0b117b769d2e717700))
* add transition to message component ([d49da84](https://github.com/PlusAuth/plusauth-widget/commit/d49da846f7c8cf3bac731864523acadb0608ba23))
* allow textField component to accepts same events used internally ([63ef2f7](https://github.com/PlusAuth/plusauth-widget/commit/63ef2f7462e48f697f81838c2813990a899f9710))
* hideMessages option for textField component ([fa353b3](https://github.com/PlusAuth/plusauth-widget/commit/fa353b372739fd471a209c33be3afda65043258c))
* make theme customizable ([49468eb](https://github.com/PlusAuth/plusauth-widget/commit/49468ebad3a5932b1457d24d228557d41ee82104))

## [0.0.2](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1...v0.0.2) (2020-08-05)

## [0.0.1](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.8...v0.0.1) (2020-08-05)

## [0.0.1-alpha.8](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2020-06-17)


### Bug Fixes

* provided scopes are not listed ([b198055](https://github.com/PlusAuth/plusauth-widget/commit/b19805585be84a50fd1c210c4be1985a637bebc0))

## [0.0.1-alpha.7](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2020-06-16)


### Bug Fixes

* this is undefined in consent reject calls ([6ed2271](https://github.com/PlusAuth/plusauth-widget/commit/6ed22715bdc872a934a40ef1c2cdeb968bed70e0))

## [0.0.1-alpha.6](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.5...v0.0.1-alpha.6) (2020-06-16)


### Bug Fixes

* this is undefined in consent method calls ([d59e371](https://github.com/PlusAuth/plusauth-widget/commit/d59e371523615bca9c9532ebcb210ed6f6b8b132))

## [0.0.1-alpha.5](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.4...v0.0.1-alpha.5) (2020-06-16)


### Bug Fixes

* wrong function call for consent submit ([ddc1628](https://github.com/PlusAuth/plusauth-widget/commit/ddc1628a9d46a6da6978a6a4623f78688398b606))

## [0.0.1-alpha.4](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.3...v0.0.1-alpha.4) (2020-06-11)

## [0.0.1-alpha.3](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.2...v0.0.1-alpha.3) (2020-06-11)


### Bug Fixes

* empty body on forgot and reset password requests ([0d49fa3](https://github.com/PlusAuth/plusauth-widget/commit/0d49fa3ea0f8bed94a1e6893e9ac2abc4883d385))
* nested translate arguments are not resolved ([4e5fbae](https://github.com/PlusAuth/plusauth-widget/commit/4e5fbae46210e0a37be8250e4134b80551b6373e))
* wrong message for password required ([731d0f0](https://github.com/PlusAuth/plusauth-widget/commit/731d0f05360850f67b313285ec2b8befc3dd90aa))


### Features

* add email validator ([554861e](https://github.com/PlusAuth/plusauth-widget/commit/554861e893053321d9d3f6231a7a3255552ac6ad))

## [0.0.1-alpha.2](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.1...v0.0.1-alpha.2) (2020-06-09)


### Features

* resolve view from mode setting if set ([2ceaea0](https://github.com/PlusAuth/plusauth-widget/commit/2ceaea01849bfb6d1a5545a4c3d52a6f2cd7467b))

## [0.0.1-alpha.1](https://github.com/PlusAuth/plusauth-widget/compare/v0.0.1-alpha.0...v0.0.1-alpha.1) (2020-06-09)


### Bug Fixes

* missing error messages of form fields ([18da96d](https://github.com/PlusAuth/plusauth-widget/commit/18da96dc8a5739637ed4f9e2e3c3989d8ed6ba51))
* password error message not displayed if policy doesnt exists ([df20b31](https://github.com/PlusAuth/plusauth-widget/commit/df20b3103a901c5d4d951a349dde7cd39bf07d2c))
* password value displayed in password strength component ([634a8c2](https://github.com/PlusAuth/plusauth-widget/commit/634a8c229d1729b77c78c354fd8d0dded5261b1e))


### Features

* implement password strength policies ([8436b54](https://github.com/PlusAuth/plusauth-widget/commit/8436b542c8f9320b84ed51f702f71a9684844d50))

## 0.0.1-alpha.0 (2020-05-18)


### Bug Fixes

* field validator typing not compiling in ts ^3.9 ([19768fe](https://github.com/PlusAuth/plusauth-widget/commit/19768fe7f402bbdcbeea0abc259b16b6b1ad58b4))
* prop functions this context not resolved in build ([320379c](https://github.com/PlusAuth/plusauth-widget/commit/320379c9ee999b8ad9efed732c5e288018db6cc8))
* remove slash prefix from child routes ([3ccbef8](https://github.com/PlusAuth/plusauth-widget/commit/3ccbef885e5eaf6ed2f16a106c0ef4b9f0132427))
* type definition of form refs are not resolved ([0ee27fe](https://github.com/PlusAuth/plusauth-widget/commit/0ee27feaa1a9a9a47274dfd230f8aeecb610cea9))
* **Message:** wrong type definition for messages ([8e48256](https://github.com/PlusAuth/plusauth-widget/commit/8e48256d3fb7356a9b4b1dc349060e5b458897d1))
* **router:** remove preceding slashes from child routes ([d887d21](https://github.com/PlusAuth/plusauth-widget/commit/d887d21d4328305f430bfb49e2ec5748985c2af2))
* **TextField:** call stack exceed when label is not provided ([f899178](https://github.com/PlusAuth/plusauth-widget/commit/f899178a7bebe8e99261288f8b7e98d92aceed65))
* wrong parameter for mfa challenges ([b51560a](https://github.com/PlusAuth/plusauth-widget/commit/b51560a1b23981f217df23afc0663f476a30df94))


### Features

* use document.body as default mount path ([9c97f81](https://github.com/PlusAuth/plusauth-widget/commit/9c97f81db5a5ade2a452fa14c33d3169c08afe9f))
* **Consent:** allow and reject actions applied ([6c7764c](https://github.com/PlusAuth/plusauth-widget/commit/6c7764c6a4067e35ef249e2d576c94e9607b1ad5))
* extend internalization support across views ([e452139](https://github.com/PlusAuth/plusauth-widget/commit/e452139eca41ec7650b28645c176c30dc84ab493))
* interpolation ability implemented for translator ([9583231](https://github.com/PlusAuth/plusauth-widget/commit/95832311b5884a6fca13cfca7e33f7464384c13b))
* **CodeInput:** digit input component created ([a09232f](https://github.com/PlusAuth/plusauth-widget/commit/a09232f0701e8a851c734473a85e07cf09912e2c))
* **FillMissing:** add loading indicator and error validation ([b5d7335](https://github.com/PlusAuth/plusauth-widget/commit/b5d733589995f088606dc3fec2bbd4051c3991bd))
* **FillMissing:** submit form ([c9d11cf](https://github.com/PlusAuth/plusauth-widget/commit/c9d11cf0e1ce25da7e41422b80cfa5e1ede4ed6e))
* **Message:** translate message values ([18aa3e6](https://github.com/PlusAuth/plusauth-widget/commit/18aa3e698722a75dc26cce18f6cba1597b481d7b))
* **Register:** use plusauth context for social connections ([1f37bf0](https://github.com/PlusAuth/plusauth-widget/commit/1f37bf0391268d193fc95c6b13cdb982eab4c897))
* social connection button created ([f68e919](https://github.com/PlusAuth/plusauth-widget/commit/f68e919e47ec1da2b90041425b4d9e08b1ca757b))
* **Login:** use plusauth context for social connections ([443172f](https://github.com/PlusAuth/plusauth-widget/commit/443172fd98582e3d535c721569e5b12d1eff12ff))
* **Message:** messages are colorable now ([e3f15ee](https://github.com/PlusAuth/plusauth-widget/commit/e3f15ee69f3c4f79dd9b08e1874f87baeb6e7547))
* **OTP:** otp page implemented ([33d8b16](https://github.com/PlusAuth/plusauth-widget/commit/33d8b163f3d07d6da0ae8857eabe0b987af45d53))
* **SMSChallenge:** submit form ([b75ec7f](https://github.com/PlusAuth/plusauth-widget/commit/b75ec7fb089ea0105c4ad1a730c36299918bee6f))
* if mfa challenges has only one challenge redirect to it ([fdfff01](https://github.com/PlusAuth/plusauth-widget/commit/fdfff01fa494efd21b497120bb93e4ff5aa7af75))

