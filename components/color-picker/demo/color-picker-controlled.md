---
title: 颜色值联动受控
order: 9
---

受控组件

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { ColorPicker, Button } from '@kdcloudjs/kdesign'

function Demo() {
  const [color, setColor] = React.useState('#ff0000')

  const onChange = (inputValue) => {
    console.log('inputValue', inputValue)
    setColor(inputValue)
  }

  const handleClick = () => {
    setColor('green')
  }

  return (
    <>
      <Button style={{ marginBottom: '20px' }} onClick={handleClick}>
        改变颜色
      </Button>
      <ColorPicker onChange={onChange} value={color} showSwitch functionalColor="#0000ff" showColorPickerBox />
    </>
  )
}

ReactDOM.render(<Demo />, mountNode)
```

受控
