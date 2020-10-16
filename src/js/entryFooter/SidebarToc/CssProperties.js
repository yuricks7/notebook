class CssProperties {

  /**
   * 
   */
  constructor() {
    this.values = {
      position: {
        static  : "static",
        fixed   : "fixed",
        absolute: "absolute",
        sticky  : "sticky",
      },
    }

    this.props = {
      box: {
        margin  : {
          top   : "marginTop",
          bottom: "marginBottom",
        },

        padding: {
          top   :"paddingTop",
          bottom:"paddingBottom",

        },

        border: {
          top   :"borderTopWidth",
          bottom:"borderBottomWidth"
        },

      },
    }
  }
}
