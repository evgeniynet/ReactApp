//Common Fonts
/* Fonts used in app */
const type = {
  regular: 'Ubuntu-Regular',
  medium: 'Ubuntu-Medium',
  bold: 'Ubuntu-Bold'
}

/* Font size sets */
const size = {
  large: 22,
  regular: 17,
  medium: 15,//14
  small: 13,//
  tiny: 8.5
}

/* Font style sets */
const style = {
  smallRegularTitle: {
    fontFamily: type.regular,
    fontSize: size.small
  },
  smallMediumTitle: {
    fontFamily: type.medium,
    fontSize: size.small
  },
  smalBoldTitle: {
    fontFamily: type.bold,
    fontSize: size.small
  },
  mediumRegularTitle: {
    fontFamily: type.medium,
    fontSize: size.regular
  },
  mediumText: {
    fontFamily: type.medium,
    fontSize: size.medium
  },
  mediumRegularText: {
    fontFamily: type.regular,
    fontSize: size.medium
  },
  mediumBoldText: {
    fontFamily: type.bold,
    fontSize: size.medium
  },
  mediumLargeTitle: {
    fontFamily: type.medium,
    fontSize: size.large
  },
  tinyRegularText: {
    fontFamily: type.regular,
    fontSize: size.tiny
  },
}

/* Exporting methods */
export default {
  type,
  size,
  style
}
