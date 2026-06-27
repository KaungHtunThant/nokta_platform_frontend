// Registers the built-in node-type and field-type components into the render registries at startup
// (OCP: new types register here without editing the renderer). Runs before any surface renders.
import { registerNodeType } from '~/lib/registries/componentRegistry'
import { registerFieldType } from '~/lib/registries/fieldTypeRegistry'

import TabsNode from '~/components/render/nodes/TabsNode.vue'
import SectionNode from '~/components/render/nodes/SectionNode.vue'
import FieldNode from '~/components/render/nodes/FieldNode.vue'

import TextInput from '~/components/render/fields/TextInput.vue'
import TextareaInput from '~/components/render/fields/TextareaInput.vue'
import NumberInput from '~/components/render/fields/NumberInput.vue'
import DateInput from '~/components/render/fields/DateInput.vue'
import BoolInput from '~/components/render/fields/BoolInput.vue'
import SelectInput from '~/components/render/fields/SelectInput.vue'
import RadioInput from '~/components/render/fields/RadioInput.vue'
import MultiSelectInput from '~/components/render/fields/MultiSelectInput.vue'
import ValueDisplay from '~/components/render/fields/ValueDisplay.vue'

export default defineNuxtPlugin(() => {
  // Node types. row/col/group reuse the section container for tolerance; board/card/nav arrive later.
  registerNodeType('tabs', TabsNode)
  registerNodeType('section', SectionNode)
  registerNodeType('row', SectionNode)
  registerNodeType('col', SectionNode)
  registerNodeType('group', SectionNode)
  registerNodeType('field', FieldNode)

  // Field types — one ValueDisplay covers all; inputs vary by widget.
  registerFieldType('text', { input: TextInput, display: ValueDisplay })
  registerFieldType('email', { input: TextInput, display: ValueDisplay })
  registerFieldType('phone', { input: TextInput, display: ValueDisplay })
  registerFieldType('textarea', { input: TextareaInput, display: ValueDisplay })
  registerFieldType('number', { input: NumberInput, display: ValueDisplay })
  registerFieldType('decimal', { input: NumberInput, display: ValueDisplay })
  registerFieldType('money', { input: NumberInput, display: ValueDisplay })
  registerFieldType('date', { input: DateInput, display: ValueDisplay })
  registerFieldType('datetime', { input: DateInput, display: ValueDisplay })
  registerFieldType('bool', { input: BoolInput, display: ValueDisplay })
  registerFieldType('checkbox', { input: BoolInput, display: ValueDisplay })
  registerFieldType('select', { input: SelectInput, display: ValueDisplay })
  registerFieldType('radio', { input: RadioInput, display: ValueDisplay })
  registerFieldType('multiselect', { input: MultiSelectInput, display: ValueDisplay })
})
