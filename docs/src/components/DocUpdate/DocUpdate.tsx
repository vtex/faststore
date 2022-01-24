import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const DocUpdate = () => {
  const { siteConfig } = useDocusaurusContext()

  // Gets data from static/data/doc-update.json
  const updatesData = JSON.parse(
    JSON.stringify(siteConfig.customFields.updatesData)
  )
  var lastUpdates = []
  var totalUpdates = 0

  var currentDate = new Date()

  // Gets the date of the previous month from the current date
  var previousDate = new Date()
  var previousMonth = previousDate.getMonth() - 1
  if (previousMonth < 0) {
    previousMonth += 12
    previousDate.setYear(previousDate.getFullYear() - 1)
  }
  previousDate.setMonth(previousMonth)

  // Check for updates in the last Month
  for (var i = 0; i < updatesData.length; i++) {
    let tempDate = new Date(updatesData[i].date)
    if (tempDate >= previousDate) {
      // Adds object to array of last updates
      lastUpdates.push(updatesData[i])
      totalUpdates += updatesData[i].docs.length
      // Saves how many days ago the update happened in the current object
      updatesData[i]['diffDays'] = Math.ceil(
        Math.abs(tempDate - currentDate) / (1000 * 60 * 60 * 24)
      )
    }
  }

  let comp

  if (lastUpdates.length > 0) {
    comp = (
      <>
        <div className="mb-6">
          <h3 className="inline-block mr-3 text-2xl font-VTEXRegular font-extralight align-middle">
            Documentation Updates
          </h3>
          <p className="inline-block px-2 rounded-full bg-pink-50 text-rebelPink">
            {totalUpdates}
          </p>
        </div>

        <div className="h-96 overflow-y-auto mb-10 sm:mb-0">
          {lastUpdates.map((item, i) => (
            <div key={i}>
              <div className="mb-2 leading-9">
                {item.type === 'Fixed' && (
                  <svg className='inline-block align-middle mr-2' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.13462 15.7692V15.7692C4.05585 15.7692 0.75 12.4634 0.75 8.38462V8.38462C0.75 4.30585 4.05585 1 8.13462 1V1C12.2134 1 15.5192 4.30585 15.5192 8.38462V8.38462C15.5192 12.4634 12.2134 15.7692 8.13462 15.7692Z" stroke="#142032" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.4166 6.74316L7.31408 10.8457L4.85254 8.38419" stroke="#142032" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                )}
                {item.type === 'Removed' && (
                  <svg className='inline-block align-middle mr-2' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.7571 5.62751C10.9975 5.86783 10.9975 6.25747 10.7571 6.49779L8.87022 8.3847L10.7571 10.2716C10.9975 10.5119 10.9975 10.9016 10.7571 11.1419C10.5168 11.3822 10.1272 11.3822 9.88684 11.1419L7.99994 9.25499L6.11303 11.1419C5.8727 11.3822 5.48306 11.3822 5.24274 11.1419C5.00242 10.9016 5.00242 10.5119 5.24274 10.2716L7.12965 8.3847L5.24274 6.49779C5.00242 6.25747 5.00242 5.86783 5.24274 5.62751C5.48306 5.38719 5.8727 5.38719 6.11303 5.62751L7.99994 7.51442L9.88684 5.62751C10.1272 5.38719 10.5168 5.38719 10.7571 5.62751Z" fill="#DC5A41" />
                    <path d="M0 8.38477C0 3.96613 3.58136 0.384766 8 0.384766C12.4186 0.384766 16 3.96613 16 8.38477C16 12.8034 12.4186 16.3848 8 16.3848C3.58136 16.3848 0 12.8034 0 8.38477ZM8 1.61553C4.2611 1.61553 1.23077 4.64586 1.23077 8.38477C1.23077 12.1237 4.2611 15.154 8 15.154C11.7389 15.154 14.7692 12.1237 14.7692 8.38477C14.7692 4.64586 11.7389 1.61553 8 1.61553Z" fill="#DC5A41" />
                  </svg>
                )}
                {item.type === 'Improved' && (
                  <svg className='inline-block align-middle mr-2' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.13462 15.7692V15.7692C4.05585 15.7692 0.75 12.4634 0.75 8.38462V8.38462C0.75 4.30585 4.05585 1 8.13462 1V1C12.2134 1 15.5192 4.30585 15.5192 8.38462V8.38462C15.5192 12.4634 12.2134 15.7692 8.13462 15.7692Z" stroke="#142032" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.4166 6.74316L7.31408 10.8457L4.85254 8.38419" stroke="#142032" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                )}
                {item.type === 'Added' && (
                  <svg className='inline-block align-middle mr-2' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4.48733C8.33987 4.48733 8.61538 4.76285 8.61538 5.10271V11.6668C8.61538 12.0067 8.33987 12.2822 8 12.2822C7.66013 12.2822 7.38462 12.0067 7.38462 11.6668V5.10271C7.38462 4.76285 7.66013 4.48733 8 4.48733Z" fill="#79A479" />
                    <path d="M4.10256 8.38477C4.10256 8.0449 4.37808 7.76938 4.71795 7.76938H11.2821C11.6219 7.76938 11.8974 8.0449 11.8974 8.38477C11.8974 8.72463 11.6219 9.00015 11.2821 9.00015H4.71795C4.37808 9.00015 4.10256 8.72463 4.10256 8.38477Z" fill="#79A479" />
                    <path d="M8 1.61553C4.2611 1.61553 1.23077 4.64586 1.23077 8.38477C1.23077 12.1237 4.2611 15.154 8 15.154C11.7389 15.154 14.7692 12.1237 14.7692 8.38477C14.7692 4.64586 11.7389 1.61553 8 1.61553ZM0 8.38477C0 3.96613 3.58136 0.384766 8 0.384766C12.4186 0.384766 16 3.96613 16 8.38477C16 12.8034 12.4186 16.3848 8 16.3848C3.58136 16.3848 0 12.8034 0 8.38477Z" fill="#79A479" />
                  </svg>
                )}
                <p className="inline-block align-middle font-medium">{item.type}</p>
                <p className="inline-block align-middle uppercase py-1 px-2 bg-whiteIce rounded-lg text-xs ml-3">{item.menu}</p>
              </div>

              <div className='pl-4 border-l ml-2 mb-4'>
                <a className='text-lg font-bold text-text hover:no-underline' href={item.path}>{item.category}</a>
                <p className="text-details mb-2">{item.diffDays} days ago</p>
                {item.docs.map((docItem, j) => (
                  <a key={j} className='block text-text hover:no-underline' href={docItem.path}>{docItem.title}</a>
                ))}
              </div>

            </div>
          ))}
        </div>
      </>
    )
  } else {
    comp = (
      <div className="mb-6">
        <h3 className="inline-block mr-3 text-2xl font-extralight align-middle">Documentation Updates</h3>
        <p>There weren't any documentation updates in the last month.</p>
      </div>
    )
  }

  return <div>{comp}</div>
}

export default DocUpdate
