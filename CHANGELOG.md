

## [0.29.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.28.1...v0.29.0) (2024-04-21)


### Features

* expose form error handler ([5487f19](https://github.com/PlusAuth/plusauth-widget/commit/5487f19f029e72c31f470b6d3abac38260c1d3fb))
* human-readable rate limit errors ([1e18794](https://github.com/PlusAuth/plusauth-widget/commit/1e1879468075b2b0706397763992ab410fd02193))
* include resend actions for applicable mfa challenges ([8a8080c](https://github.com/PlusAuth/plusauth-widget/commit/8a8080c63534d46eb09b8b364c4e74cb87063cdb))
* **translator:** allow array to be passed to v-t directive ([eddec6b](https://github.com/PlusAuth/plusauth-widget/commit/eddec6b66b24a57fc6053717c121e050e4773e49))


### Bug Fixes

* empty error message for fetch errors ([e2b0ec5](https://github.com/PlusAuth/plusauth-widget/commit/e2b0ec5c9ef7fa381079917e867b972d977efb4c))
* form generics does not allow computed default fields ([06b0ffe](https://github.com/PlusAuth/plusauth-widget/commit/06b0ffef486608b081f818230a67743fcbc1616a))


### Stylistic Updates

* additional spacing between multiple elements in content footer ([b3af69a](https://github.com/PlusAuth/plusauth-widget/commit/b3af69ab75ae29f902f5154916603250c7d6fb4a))
* cleanup reset css ([aab028c](https://github.com/PlusAuth/plusauth-widget/commit/aab028c3e232632978118b91ffa5a6859cc0153a))
* remove top margin from alert if it is after an input contains error ([6f6b8e5](https://github.com/PlusAuth/plusauth-widget/commit/6f6b8e5369b115bb88758cd17670e9b6f65159af))
* remove top margin from footer if it is after helper section ([fd29144](https://github.com/PlusAuth/plusauth-widget/commit/fd29144b75193b7ea27ebe48249a4150b8616aa4))
* set logo height to 96px ([66a3b84](https://github.com/PlusAuth/plusauth-widget/commit/66a3b84ef26adbd4b773e171a1b1830f5c525fb2))

## [0.28.1](https://github.com/PlusAuth/plusauth-widget/compare/v0.28.0...v0.28.1) (2024-04-20)


### Bug Fixes

* regression in [#7cf0b92f](https://github.com/PlusAuth/plusauth-widget/issues/7cf0b92f) ([625fc60](https://github.com/PlusAuth/plusauth-widget/commit/625fc60d0351582c4e38b93ed0ca8807e7a62139)), closes [#7cf0b92](https://github.com/PlusAuth/plusauth-widget/issues/7cf0b92)

## [0.28.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.27.0...v0.28.0) (2024-04-20)


### Features

* allow accessing raw response from error ([dfef284](https://github.com/PlusAuth/plusauth-widget/commit/dfef284beef77f4a1cfc61ddc2a65d5a48934111))


### Bug Fixes

* prevent not found image shown for register page ([40a7b51](https://github.com/PlusAuth/plusauth-widget/commit/40a7b51a947eb7e6b0848fe1ae3481db878e4f3c))


### Refactors

* migrate to eslint@9 ([e28cb25](https://github.com/PlusAuth/plusauth-widget/commit/e28cb257db1a64c24e1110eb97d10b62c9dcc6c6))

## [0.27.0](https://github.com/PlusAuth/plusauth-widget/compare/v0.26.0...v0.27.0) (2024-04-05)


### Features

* **i18n:** allow fallback path to be translated also ([606898d](https://github.com/PlusAuth/plusauth-widget/commit/606898dfbe533e254f145d0ad0ce5602daaba4bd))
* **i18n:** better error localization ([7cf0b92](https://github.com/PlusAuth/plusauth-widget/commit/7cf0b92f8244bd764ed8469158276cf7733c71d4))
* **i18n:** fallback support for i18n functions ([487fb93](https://github.com/PlusAuth/plusauth-widget/commit/487fb93c38f9dcf0de674ed8c724592238475934))
* pass form ref and fields to responseErrorHandler ([d0c0986](https://github.com/PlusAuth/plusauth-widget/commit/d0c09861aca3eb58bd7a59e51b86c08f1bac96d9))


### Bug Fixes

* **i18n:** arrays are not interpolated by indexes, regression in [#38893c](https://github.com/PlusAuth/plusauth-widget/issues/38893c) ([8ddef61](https://github.com/PlusAuth/plusauth-widget/commit/8ddef61871582d706a06afc5a1f012f47c4def07)), closes [#38893](https://github.com/PlusAuth/plusauth-widget/issues/38893)
* **i18n:** locale fallback path is not passed to directive ([16dd6bf](https://github.com/PlusAuth/plusauth-widget/commit/16dd6bf7e2426edb2451c58205222579607587e8))
* invalid prop passed to generic form ([6e90c7d](https://github.com/PlusAuth/plusauth-widget/commit/6e90c7d99b4046fbd6a15c5d1100704d9de4c70a))


### Stylistic Updates

* **TextField:** inherit ring color for inner button ([05a72d0](https://github.com/PlusAuth/plusauth-widget/commit/05a72d032d654b77ad1344ab9aa30d9d70e7d17f))

See [Releases](https://github.com/PlusAuth/plusauth-widget/releases)
