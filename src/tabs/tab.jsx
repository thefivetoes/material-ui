import React from 'react';
import StylePropable from '../mixins/style-propable';
import DefaultRawTheme from '../styles/raw-themes/light-raw-theme';
import ThemeManager from '../styles/theme-manager';

const Tab = React.createClass({

  propTypes: {
    /**
     * The css class name of the root element.
     */
    className: React.PropTypes.string,

    /**
     * Sets the icon of the tab, you can pass `FontIcon` or `SvgIcon` elements.
     */
    icon: React.PropTypes.node,

    /**
     * Sets the text value of the tab item to the string specified.
     */
    label: React.PropTypes.node,

    /**
     * Fired when the active tab changes by touch or tap.
     * Use this event to specify any functionality when an active tab changes.
     * For example - we are using this to route to home when the third tab becomes active.
     * This function will always recieve the active tab as it\'s first argument.
     */
    onActive: React.PropTypes.func,

    /**
     * This property is overriden by the Tabs component.
     */
    onTouchTap: React.PropTypes.func,

    /**
     * Defines if the current tab is selected or not.
     * The Tabs component is responsible for setting this property.
     */
    selected: React.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: React.PropTypes.object,

    /**
     * If value prop passed to Tabs component, this value prop is also required.
     * It assigns a value to the tab so that it can be selected by the Tabs.
     */
    value: React.PropTypes.any,

    /**
     * This property is overriden by the Tabs component.
     */
    width: React.PropTypes.string,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [
    StylePropable,
  ],

  getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps(nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  _handleTouchTap(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(this.props.value, event, this);
    }
  },

  render() {
    const {
      label,
      onActive,
      onTouchTap,
      selected,
      style,
      value,
      width,
      icon,
      ...other,
    } = this.props;

    const textColor = selected ? this.state.muiTheme.tabs.selectedTextColor : this.state.muiTheme.tabs.textColor;

    const styles = this.mergeStyles({
      display: 'table-cell',
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'middle',
      paddingTop: (icon && !label) ? 4 : 0,
      height: (label && icon) ? 72 : 48,
      color: textColor,
      outline: 'none',
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'initial',
      fontFamily: this.state.muiTheme.rawTheme.fontFamily,
      boxSizing: 'border-box',
      width: width,
    }, style);

    let iconElement;
    if (icon && React.isValidElement(icon)) {
      const params = {
        style: {
          fontSize: 24,
          marginBottom: (label) ? 4 : 0,
          display: label ? 'block' : 'inline-block',
          color: textColor,
        },
      };
      // If it's svg icon set color via props
      if (icon.type.displayName !== 'FontIcon') {
        params.color = textColor;
      }
      iconElement = React.cloneElement(icon, params);
    }

    return (
      <div
        {...other}
        style={this.prepareStyles(styles)}
        onTouchTap={this._handleTouchTap}
      >
        {iconElement}
        {label}
      </div>
    );
  },

});

export default Tab;
