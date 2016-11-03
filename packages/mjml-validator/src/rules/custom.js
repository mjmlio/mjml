import fs       from 'fs'
import filter   from 'lodash/filter'

const cwd = process.cwd()

const customRules = {
  validators: [],
  hasCustomRules () {
    try {
      fs.statSync(`${cwd}/.mjmlconfig`);
      const config = JSON.parse(fs.readFileSync(`${cwd}/.mjmlconfig`).toString());
      this.validators = config.validators;
      return !!config.validators;
    } catch (e) {
      return false;
    }
  },
  getCustomRules (defaultRules) {
    let rules = [];

    rules = filter(defaultRules, (fun, name) =>
      this.validators.indexOf(name) > -1 &&
      this.validators.splice(this.validators.indexOf(name), 1)
    )

    this.validators.forEach((validator) => {
      if (typeof validator == 'string') {
        if (validator.charAt(0) == '.') {
          rules.push(require(`${cwd}/${validator}`))
        }
      } else if (typeof validator == 'object') {
              // Utiliser le json
      }
    })

    return rules;
  }
}

export default customRules;
