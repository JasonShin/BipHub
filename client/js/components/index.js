import AppCard from './AppCard'
import AppIcon from './AppIcon'
import Button from './Button'
import Card from './Card'
import Icon from './Icon'
import InfoBox from './InfoBox'
import LogoText from './LogoText'
import MenuItem from './MenuItem'
import SearchBar from './SearchBar'
import Select from './Select'
import Steps from './Steps'
import UserProfile from './UserProfile'
import Radio from './Radio'
import Dialog from './Dialog'

const components = [
  Button,
  AppCard,
  AppIcon,
  Card,
  Icon,
  InfoBox,
  LogoText,
  MenuItem,
  SearchBar,
  Select,
  Steps,
  UserProfile,
  Radio,
  Dialog
]

/**
 * Install method is exposed to Vue
 * @param Vue
 * @param options
 */
const install = (Vue, options = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}
