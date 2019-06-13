const yaml = require('yaml')

function formatParams (params = []) {
  return params.map(function (entry) {
    if (entry.name.length !== 0) {
      return `${entry.type} ${entry.name}`
    } else {
      return entry.type
    }
  }).join(', ')
}

function formatMutability (mutability) {
  if (mutability === 'view' || mutability === 'pure' || mutability === 'payable') {
    return mutability
  } else if (mutability === 'nonpayable') {
    return ''
  } else {
    assert(false, 'Unsupported mutability')
  }
}

function formatEntries (input) {
  return input.map(function (entry) {
    var tmp = "  "
    if (entry.type === 'function') {
      tmp += `function ${entry.name}`
    } else if (entry.type === 'constructor') {
      tmp += "constructor"
    } else if (entry.type === 'fallback') {
      tmp += "fallback"
    } else {
      assert(false, 'Unsupported entry type')
    }
    tmp += `(${formatParams(entry.inputs)})`
    if (entry.stateMutability && entry.stateMutability.length !== 0)
      tmp += ` ${formatMutability(entry.stateMutability)}`
    if (entry.outputs && entry.outputs.length !== 0)
      tmp += ` returns (${formatParams(entry.outputs)})`
    tmp += ';'
    return tmp
  }).join('\n')
}

function yaml2interface (input) {
  const parsed = yaml.parse(input)

  var output = []
  for (var int in parsed) {
    output.push(`interface ${int} {\n${formatEntries(parsed[int])}\n}`)
  }
  return output.join('\n\n')
}

module.exports = yaml2interface

var example = `
# The transfer function. Takes the recipient address
# as an input and returns a boolean signaling the result.
ERC20:
- name: transfer
  type: function
  payable: false
  constant: false
  stateMutability: nonpayable
  inputs:
  - name: recipient
    type: address
  - name: amount
    type: uint256
  outputs:
  - name: ''
    type: bool
- name: balance
  type: function

ERC2020:
- name: transfer
  type: function
- name: balance
  type: function
`

console.log(yaml2interface(example))
