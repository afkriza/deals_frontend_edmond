<template>
  <div>
    <span :class="$style.name">
      {{ name }}
    </span>
    <ul v-if="dashboards.length" :class="$style.items">
      <li
        v-for="dashboard in dashboards"
        :key="dashboard.id"
        :class="$style.item"
      >
        <router-link
          :class="$style.link"
          :to="{
            name:
              namespace === RATE_SHOPPER
                ? pages.DASHBOARD_RATE_SHOPPER
                : pages.DASHBOARD,
            params: { id: dashboard.id }
          }"
        >
          <span>{{ dashboard.name }}</span>
          <slot name="dashboard" :dashboard="dashboard" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { pages } from 'enums/pages';
  import { ANALYTICS, RATE_SHOPPER } from 'constants/namespaces';

  export default {
    props: {
      name: {
        type: String,
        required: true
      },
      dashboards: {
        type: Array,
        required: true,
        validator(value) {
          return value.every(dashboard =>
            Boolean(dashboard.id && dashboard.name)
          );
        }
      },
      namespace: {
        type: String,
        required: true,
        validator(value) {
          return [ANALYTICS, RATE_SHOPPER].includes(value);
        }
      }
    },
    data() {
      return {
        pages,
        ANALYTICS,
        RATE_SHOPPER
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .name {
    font-size: 12px;
    font-weight: bold;
    line-height: 20px;

    display: block;
    padding: 8px 16px;

    color: $color-text-main;
    text-transform: uppercase;
    letter-spacing: 0.2px;
  }

  .items {
    margin: 0;
    padding: 0;

    list-style-type: none;
  }

  .item {
    white-space: nowrap;
  }

  .link {
    display: flex;
    padding: 6px 16px;

    color: inherit;
    text-decoration: none;
    font-size: 14px;
    align-items: center;

    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }
</style>
