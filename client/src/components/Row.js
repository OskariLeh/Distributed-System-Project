import React from 'react'

function Row(props) {

    const range = (start, stop, step) => 
      Array.from(
        {length: (stop - start) / step + 1},
        (value, index) => start + index * step
      ) 
    
    const days = range(props.start, props.stop, 1)
    const daysUsed = days.slice(-days.length, props.numberOfDays)
    const items = daysUsed.map((day) => {
      return (
        <div key={day} className='day-box' onClick={() => props.handleClick(day)}>
          <h3>{day}</h3>
        </div>
      )
    })
    
  return (
    <div>
      {items}
    </div>
  )
}

export default Row