class QueryFilter {
  constructor() {
    this.filter = {
      conditions: [],
    };
  }

  addCondition = (field, value, operator = 'EQUAL') => {
    this.filter.conditions.push({ field, value, operator });
    return this;
  }

  data = () => {
    return this.filter;
  }
}

export default QueryFilter;
