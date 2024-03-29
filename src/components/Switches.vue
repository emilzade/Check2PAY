<template>
  <label
    style="width: 130px"
    class="d-flex justify-content-between align-items-center"
    :class="classObject"
  >
    <span
      style="width: 80px; text-align: center"
      class="vue-switcher__label"
      v-if="shouldShowLabel"
    >
      <span v-if="label" v-text="label"></span>
      <span
        class="text-center fs-5 text-green"
        v-if="!label && value"
        v-text="textEnabled"
      ></span>
      <span
        class="text-center fs-5 text-primary"
        v-if="!label && !value"
        v-text="textDisabled"
      ></span>
    </span>

    <input
      type="checkbox"
      :disabled="disabled"
      @change="trigger"
      :checked="value"
    />

    <div></div>
  </label>
</template>

<script>
export default {
  name: 'switches',

  props: {
    typeBold: {
      default: false,
    },

    value: {
      default: false,
    },

    disabled: {
      default: false,
    },

    label: {
      default: '',
    },

    textEnabled: {
      default: '',
    },

    textDisabled: {
      default: '',
    },

    color: {
      default: 'default',
    },

    theme: {
      default: 'default',
    },

    emitOnMount: {
      default: true,
    },
  },

  mounted() {
    if (this.emitOnMount) {
      this.$emit('triggerOnMount', this.value)
    }
  },

  methods: {
    trigger(e) {
      this.$emit('trigger', e.target.checked)
    },
  },

  computed: {
    classObject() {
      const { color, value, theme, typeBold, disabled } = this

      return {
        'vue-switcher': true,
        ['vue-switcher--unchecked']: !value,
        ['vue-switcher--disabled']: disabled,
        ['vue-switcher--bold']: typeBold,
        ['vue-switcher--bold--unchecked']: typeBold && !value,
        [`vue-switcher-theme--${theme}`]: color,
        [`vue-switcher-color--${color}`]: color,
      }
    },

    shouldShowLabel() {
      return (
        this.label !== '' || this.textEnabled !== '' || this.textDisabled !== ''
      )
    },
  },
}
</script>

<style lang="scss">
/**
 * Default
 */
$color-default-default: #aaa;
$color-default-green: #53b96e;
$color-default-blue: #539bb9;
$color-default-red: #b95353;
$color-default-orange: #b97953;
$color-default-yellow: #bab353;

$theme-default-colors: (
  default: $color-default-default,
  blue: $color-default-blue,
  red: $color-default-red,
  yellow: $color-default-yellow,
  orange: $color-default-orange,
  green: $color-default-green,
);

/**
 * Bulma
 */
$color-bulma-default: #f5f5f5;
$color-bulma-primary: #00d1b2;
$color-bulma-blue: #3273dc;
$color-bulma-red: #ff3860;
$color-bulma-yellow: #ffdd57;
$color-bulma-green: #22c65b;

$theme-bulma-colors: (
  default: $color-bulma-default,
  primary: $color-bulma-primary,
  blue: $color-bulma-blue,
  red: $color-bulma-red,
  yellow: $color-bulma-yellow,
  green: $color-bulma-green,
);

/**
 * Bootstrap
 */
$color-bootstrap-default: #fff;
$color-bootstrap-primary: #337ab7;
$color-bootstrap-success: #5cb85c;
$color-bootstrap-info: #5bc0de;
$color-bootstrap-warning: #f0ad4e;
$color-bootstrap-danger: #c9302c;

$theme-bootstrap-colors: (
  default: $color-bootstrap-default,
  primary: $color-bootstrap-primary,
  success: $color-bootstrap-success,
  info: $color-bootstrap-info,
  warning: $color-bootstrap-warning,
  danger: $color-bootstrap-danger,
);

.vue-switcher {
  position: relative;
  display: inline-block;

  &__label {
    display: block;
    font-size: 10px;
    margin-bottom: 5px;
  }

  input {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    cursor: pointer;
  }

  div {
    height: 15px;
    width: 36px;
    position: relative;
    border-radius: 30px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    transition: linear 0.2s, background-color linear 0.2s;

    &:after {
      content: '';
      height: 20px;
      width: 20px;
      border-radius: 100px;
      display: block;
      transition: linear 0.15s, background-color linear 0.15s;
      position: absolute;
      left: 100%;
      margin-left: -18px;
      cursor: pointer;
      top: -3px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    }
  }

  &--unchecked {
    div {
      justify-content: flex-end;

      &:after {
        left: 15px;
      }
    }
  }

  &--disabled {
    div {
      opacity: 0.3;
    }

    input {
      cursor: not-allowed;
    }
  }

  &--bold {
    div {
      top: -8px;
      height: 26px;
      width: 51px;

      &:after {
        margin-left: -24px;
        top: 3px;
      }
    }

    &--unchecked {
      div {
        &:after {
          left: 28px;
        }
      }
    }

    .vue-switcher__label {
      span {
        padding-bottom: 7px;
        display: inline-block;
      }
    }
  }

  &-theme--default {
    @each $colorName, $color in $theme-default-colors {
      &.vue-switcher-color--#{$colorName} {
        div {
          @if $colorName == 'default' {
            background-color: lighten($color, 5%);
          } @else {
            background-color: lighten($color, 10%);
          }

          &:after {
            @if $colorName == 'default' {
              background-color: darken($color, 5%);
            } @else {
              background-color: $color;
            }
          }
        }

        &.vue-switcher--unchecked {
          div {
            @if $colorName == 'default' {
              background-color: $color;
            } @else {
              background-color: lighten($color, 30%);
            }

            &:after {
              background-color: lighten($color, 10%);
            }
          }
        }
      }
    }
  }

  &-theme--bulma {
    @each $colorName, $color in $theme-bulma-colors {
      &.vue-switcher-color--#{$colorName} {
        div {
          @if $colorName == 'default' {
            background-color: darken($color, 10%);
          } @else {
            background-color: lighten($color, 10%);
          }

          &:after {
            background-color: $color;
          }
        }

        &.vue-switcher--unchecked {
          div {
            @if $colorName == 'default' or $colorName == 'yellow' {
              background-color: darken($color, 5%);
            } @else {
              background-color: lighten($color, 30%);
            }

            &:after {
              @if $colorName == 'default' {
                background-color: $color;
              } @else {
                background-color: lighten($color, 10%);
              }
            }
          }
        }
      }
    }
  }

  &-theme--bootstrap {
    @each $colorName, $color in $theme-bootstrap-colors {
      &.vue-switcher-color--#{$colorName} {
        div {
          @if $colorName == 'default' {
            background-color: darken($color, 10%);
          } @else {
            background-color: lighten($color, 10%);
          }

          &:after {
            @if $colorName == 'default' {
              background-color: darken($color, 6%);
            } @else {
              background-color: $color;
            }
          }
        }

        &.vue-switcher--unchecked {
          div {
            @if $colorName == 'default' {
              background-color: darken($color, 4%);
            } @else {
              background-color: lighten($color, 30%);
            }

            &:after {
              @if $colorName == 'default' {
                background-color: darken($color, 6%);
              } @else {
                background-color: lighten($color, 10%);
              }
            }
          }
        }
      }
    }
  }
}
/**
 * Default
 */
/**
 * Bulma
 */
/**
 * Bootstrap
 */
.vue-switcher {
  position: relative;
  display: inline-block;
}
.vue-switcher__label {
  display: block;
  font-size: 10px;
  margin-bottom: 5px;
}
.vue-switcher input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  cursor: pointer;
}
.vue-switcher div {
  height: 15px;
  width: 36px;
  position: relative;
  border-radius: 30px;
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: linear 0.2s, background-color linear 0.2s;
}
.vue-switcher div:after {
  content: '';
  height: 20px;
  width: 20px;
  border-radius: 100px;
  display: block;
  transition: linear 0.15s, background-color linear 0.15s;
  position: absolute;
  left: 100%;
  margin-left: -18px;
  cursor: pointer;
  top: -3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
}
.vue-switcher--unchecked div {
  justify-content: flex-end;
}
.vue-switcher--unchecked div:after {
  left: 15px;
}
.vue-switcher--disabled div {
  opacity: 0.3;
}
.vue-switcher--disabled input {
  cursor: not-allowed;
}
.vue-switcher--bold div {
  top: -8px;
  height: 26px;
  width: 51px;
}
.vue-switcher--bold div:after {
  margin-left: -24px;
  top: 3px;
}
.vue-switcher--bold--unchecked div:after {
  left: 28px;
}
.vue-switcher--bold .vue-switcher__label span {
  padding-bottom: 7px;
  display: inline-block;
}
.vue-switcher-theme--default.vue-switcher-color--default div {
  background-color: #b7b7b7;
}
.vue-switcher-theme--default.vue-switcher-color--default div:after {
  background-color: #9d9d9d;
}
.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked
  div {
  background-color: #aaa;
}
.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked
  div:after {
  background-color: #c4c4c4;
}
.vue-switcher-theme--default.vue-switcher-color--blue div {
  background-color: #77b0c8;
}
.vue-switcher-theme--default.vue-switcher-color--blue div:after {
  background-color: #539bb9;
}
.vue-switcher-theme--default.vue-switcher-color--blue.vue-switcher--unchecked
  div {
  background-color: #c0dae5;
}
.vue-switcher-theme--default.vue-switcher-color--blue.vue-switcher--unchecked
  div:after {
  background-color: #77b0c8;
}
.vue-switcher-theme--default.vue-switcher-color--red div {
  background-color: #c87777;
}
.vue-switcher-theme--default.vue-switcher-color--red div:after {
  background-color: #b95353;
}
.vue-switcher-theme--default.vue-switcher-color--red.vue-switcher--unchecked
  div {
  background-color: #e5c0c0;
}
.vue-switcher-theme--default.vue-switcher-color--red.vue-switcher--unchecked
  div:after {
  background-color: #c87777;
}
.vue-switcher-theme--default.vue-switcher-color--yellow div {
  background-color: #c9c377;
}
.vue-switcher-theme--default.vue-switcher-color--yellow div:after {
  background-color: #bab353;
}
.vue-switcher-theme--default.vue-switcher-color--yellow.vue-switcher--unchecked
  div {
  background-color: #e6e3c0;
}
.vue-switcher-theme--default.vue-switcher-color--yellow.vue-switcher--unchecked
  div:after {
  background-color: #c9c377;
}
.vue-switcher-theme--default.vue-switcher-color--orange div {
  background-color: #c89577;
}
.vue-switcher-theme--default.vue-switcher-color--orange div:after {
  background-color: #b97953;
}
.vue-switcher-theme--default.vue-switcher-color--orange.vue-switcher--unchecked
  div {
  background-color: #e5cec0;
}
.vue-switcher-theme--default.vue-switcher-color--orange.vue-switcher--unchecked
  div:after {
  background-color: #c89577;
}
.vue-switcher-theme--default.vue-switcher-color--green div {
  background-color: #80e59b;
}
.vue-switcher-theme--default.vue-switcher-color--green div:after {
  background-color: #53b96e;
}
.vue-switcher-theme--default.vue-switcher-color--green.vue-switcher--unchecked
  div {
  background-color: #ff87eb;
}
.vue-switcher-theme--default.vue-switcher-color--green.vue-switcher--unchecked
  div:after {
  background-color: #c735af;
}
.vue-switcher-theme--bulma.vue-switcher-color--default div {
  background-color: gainsboro;
}
.vue-switcher-theme--bulma.vue-switcher-color--default div:after {
  background-color: #f5f5f5;
}
.vue-switcher-theme--bulma.vue-switcher-color--default.vue-switcher--unchecked
  div {
  background-color: #e8e8e8;
}
.vue-switcher-theme--bulma.vue-switcher-color--default.vue-switcher--unchecked
  div:after {
  background-color: #f5f5f5;
}
.vue-switcher-theme--bulma.vue-switcher-color--primary div {
  background-color: #05ffda;
}
.vue-switcher-theme--bulma.vue-switcher-color--primary div:after {
  background-color: #00d1b2;
}
.vue-switcher-theme--bulma.vue-switcher-color--primary.vue-switcher--unchecked
  div {
  background-color: #6bffe9;
}
.vue-switcher-theme--bulma.vue-switcher-color--primary.vue-switcher--unchecked
  div:after {
  background-color: #05ffda;
}
.vue-switcher-theme--bulma.vue-switcher-color--blue div {
  background-color: #5e91e3;
}
.vue-switcher-theme--bulma.vue-switcher-color--blue div:after {
  background-color: #3273dc;
}
.vue-switcher-theme--bulma.vue-switcher-color--blue.vue-switcher--unchecked
  div {
  background-color: #b5ccf2;
}
.vue-switcher-theme--bulma.vue-switcher-color--blue.vue-switcher--unchecked
  div:after {
  background-color: #5e91e3;
}
.vue-switcher-theme--bulma.vue-switcher-color--red div {
  background-color: #ff6b89;
}
.vue-switcher-theme--bulma.vue-switcher-color--red div:after {
  background-color: #ff3860;
}
.vue-switcher-theme--bulma.vue-switcher-color--red.vue-switcher--unchecked div {
  background-color: #ffd1da;
}
.vue-switcher-theme--bulma.vue-switcher-color--red.vue-switcher--unchecked
  div:after {
  background-color: #ff6b89;
}
.vue-switcher-theme--bulma.vue-switcher-color--yellow div {
  background-color: #ffe78a;
}
.vue-switcher-theme--bulma.vue-switcher-color--yellow div:after {
  background-color: #ffdd57;
}
.vue-switcher-theme--bulma.vue-switcher-color--yellow.vue-switcher--unchecked
  div {
  background-color: #fffcf0;
}
.vue-switcher-theme--bulma.vue-switcher-color--yellow.vue-switcher--unchecked
  div:after {
  background-color: #ffe78a;
}
.vue-switcher-theme--bulma.vue-switcher-color--green div {
  background-color: #3dde75;
}
.vue-switcher-theme--bulma.vue-switcher-color--green div:after {
  background-color: #22c65b;
}
.vue-switcher-theme--bulma.vue-switcher-color--green.vue-switcher--unchecked
  div {
  background-color: #9fc4e4;
}
.vue-switcher-theme--bulma.vue-switcher-color--green.vue-switcher--unchecked
  div:after {
  background-color: #337ab7;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--default div {
  background-color: #e6e6e6;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--default div:after {
  background-color: #f0f0f0;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--default.vue-switcher--unchecked
  div {
  background-color: whitesmoke;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--default.vue-switcher--unchecked
  div:after {
  background-color: #f0f0f0;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--primary div {
  background-color: #4f93ce;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--primary div:after {
  background-color: #337ab7;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--primary.vue-switcher--unchecked
  div {
  background-color: #9fc4e4;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--primary.vue-switcher--unchecked
  div:after {
  background-color: #4f93ce;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--success div {
  background-color: #80c780;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--success div:after {
  background-color: #5cb85c;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--success.vue-switcher--unchecked
  div {
  background-color: #c7e6c7;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--success.vue-switcher--unchecked
  div:after {
  background-color: #80c780;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--info div {
  background-color: #85d0e7;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--info div:after {
  background-color: #5bc0de;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--info.vue-switcher--unchecked
  div {
  background-color: #daf1f8;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--info.vue-switcher--unchecked
  div:after {
  background-color: #85d0e7;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--warning div {
  background-color: #f4c37d;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--warning div:after {
  background-color: #f0ad4e;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--warning.vue-switcher--unchecked
  div {
  background-color: #fceedb;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--warning.vue-switcher--unchecked
  div:after {
  background-color: #f4c37d;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--danger div {
  background-color: #d9534f;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--danger div:after {
  background-color: #c9302c;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--danger.vue-switcher--unchecked
  div {
  background-color: #eba5a3;
}
.vue-switcher-theme--bootstrap.vue-switcher-color--danger.vue-switcher--unchecked
  div:after {
  background-color: #d9534f;
}
</style>
