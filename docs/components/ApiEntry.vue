<template>
  <div class="api_entry">
    <h2 class="name"># {{entry.name}}</h2>
    <div class="api_entry_container">
      <api-paragraph
        v-for="(d, k) in entry.description.children"
        :key="`api-entry-desc-${k}`"
        :data="d"
      ></api-paragraph>
      <div class="signature">{{signature(entry)}}</div>
      <h4>Parameters</h4>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(param, k) in params"
            :key="`api-entry-param-${k}`"
          >
            <td>{{param.name}}</td>
            <td>{{formatType(param.type)}}</td>
            <td>{{param.default}}</td>
            <td v-if="!!param.description">
              <api-paragraph
                v-for="(par, l) in param.description.children"
                :key="`api-entry-param-par-${k}-${l}`"
                :data="par"
              ></api-paragraph>
            </td>
          </tr>
        </tbody>
      </table>
      <h4 v-if="entry.returns.length">Returns</h4>
      <div
        class="returns"
        v-if="entry.returns.length"
      >
        <code style='margin-left: 10px;'>{{entry.returns[0].type && entry.returns[0].type.name}}</code>
        <span v-if="!!entry.returns[0].description">
          <api-paragraph
            v-for="(par, l) in entry.returns[0].description.children"
            :key="`api-entry-ret-par-${l}`"
            :data="par"
          ></api-paragraph>
        </span>
      </div>
      <h4 v-if="entry.kind === 'class'">Methods</h4>
      <div
        class="methods"
        v-if="entry.kind === 'class'"
      >
        <ul class="classMethod">
          <li v-for="m in entry.members.instance">
            .{{signature(m)}}
          </li>
        </ul>
        <div
          v-for="parent in entry.augments.map(x => findEntry(x.name))"
          v-if="parent"
        >
          <i>Inherited from {{parent.name}}:</i>
          <ul class="classMethod">
            <li
              v-for="m in parent.members.instance"
              v-if="!entry.members.instance.map(x => x.name).includes(m.name)"
            >
              .{{signature(m)}}
            </li>
          </ul>
        </div>
      </div>
      <h4>Examples</h4>
      <div
        class="example"
        v-for="(example, k) in entry.examples"
        :key="`api-entry-example-${k}`"
      >
        <div v-if="!!example.caption">
          <api-paragraph
            v-for="(par, l) in example.caption.children"
            :key="`api-entry-param-par-${k}-${l}`"
            :data="par"
          ></api-paragraph>
        </div>
        <code-example
          :code="example.description"
          :name="`${entry.name}-ex-${k}`"
        ></code-example>
      </div>
      <!-- TODO: Context in File -->
      <!-- {{entry.context}}<br> -->
    </div>
  </div>
</template>

<script>
import ApiParagraph from './ApiParagraph.vue';
import CodeExample from './CodeExample.vue';

export default {
  name: 'api-entry',
  components: { ApiParagraph, CodeExample },
  props: {
    entry: Object,
    allEntries: Object,
  },
  computed: {
    params() {
      const p = [];
      this.entry.params.forEach((param) => {
        p.push(param);
        if (param.properties) {
          param.properties.forEach((prop) => {
            p.push(prop);
          });
        }
      });
      return p;
    },
  },
  methods: {
    signature(entry) {
      const params = entry.params
        .map(x => `${x.name}${x.type && ': '}${x.type && x.type.name}`)
        .join(', ');
      const ret = entry.returns && entry.returns.length
        && entry.returns[0].type
        && `: ${entry.returns[0].type.name}`;
      return `${entry.name}(${params})${ret}`;
    },
    formatType(t) {
      if (t) {
        if (t.type === 'NameExpression') {
          return t.name;
        }
        if (t.type === 'OptionalType') {
          return t.expression.name;
        }
        if (t.type === 'TypeApplication') {
          return `${this.formatType(t.expression)}<${t.applications.map(this.formatType)}>`;
        }
        if (t.type === 'UnionType') {
          return t.elements.map(this.formatType)
            .reduce((x, y) => `${x} | ${y}`, '')
            .slice(2);
        }
        return t;
      }
      return '';
    },
    findEntry(name) {
      return Object.values(this.allEntries)
        .reduce((x, y) => x.concat(y), [])
        .find(x => x.name === name);
    },
  },
};
</script>

<style scoped>
.api_entry {
  margin-bottom: 8px;
  background: #fff;
  padding-left: 15px;
  padding-top: 2px;
}
.api_entry_container {
  margin-left: 16px;
}
h2.name {
  color: #0f5595;
  margin-bottom: 4px;
  font-size: 18px;
}
h4 {
  color: #878787;
}
.signature {
  font-family: Source Code Pro, monospace;
  background: #f5f5f5;
  margin-top: 8px;
  margin-bottom: 4px;
  padding: 10px;
  color: #5c5c5c;
}
ul.classMethod {
  list-style: none;
}
</style>