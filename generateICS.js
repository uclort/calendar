const { SolarMonth } = require('./lunar.js')
const fs = require('fs')

const startYear = 2020
const endYear = 2030

let result = []
result.push(generateICSHeader())
let dateGroup = getYearMonth()
dateGroup.forEach(date => {
  let solarMonth = SolarMonth.fromYm(date.year, date.month)
  var days = solarMonth.getDays();
  for (var i = 0, j = days.length; i < j; i++) {
    // 公历日期对象
    let day = days[i]
    // 公历当前年
    let solarYear = day.getYear().toString()
    // 公历当前月
    let solarMonth = day.getMonth().toString().padStart(2, '0')
    // 公历当前日
    let solarDay = day.getDay().toString().padStart(2, '0')
    // 公历当前日期
    let solarDate = `${solarYear}${solarMonth}${solarDay}`
    console.log(solarDate)
    // 公历当前日期的节日
    let solarFestivals = day.getFestivals()
    // 公里当前日期的其他节日
    let solarOtherFestivals = day.getFestivals()
    // 公历当前日期对应的农历
    let lunar = day.getLunar()
    // 农历当前月对应的中文
    let monthChinese = lunar.getMonthInChinese().toString()
    // 农历当前日对应的中文
    let dayChinese = lunar.getDayInChinese().toString()
    // 农历当前日期的节日
    let lunarFestivals = lunar.getFestivals()
    // 农历当前日期的其他节日
    let lunarOtherFestivals = lunar.getFestivals()
    // 农历当前日期
    let lunarDate = `${monthChinese}月${dayChinese}`
    // console.log(`${solarDate} -> ${lunarDate}`)
    // console.log("公历节日 -> " + solarFestivals)
    // console.log("公历其他节日 -> " + solarOtherFestivals)
    // console.log("农历节日 -> " + lunarFestivals)
    // console.log("农历其他节日 -> " + lunarOtherFestivals)
    // console.log("---------------------------------")
    result.push(generateICSItem(solarDate, lunarDate))
    solarFestivals.forEach(festival => {
      result.push(generateICSItem(solarDate, festival))
    })
    solarOtherFestivals.forEach(festival => {
      result.push(generateICSItem(solarDate, festival))
    })
    lunarFestivals.forEach(festival => {
      result.push(generateICSItem(solarDate, festival))
    })
    lunarOtherFestivals.forEach(festival => {
      result.push(generateICSItem(solarDate, festival))
    })
  }
})
result.push(generateICSFooter())

const resultString = result.join("\n")
// console.log(resultString)

fs.writeFile('./calendar.ics', resultString, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log("写入成功")
})

function getYearMonth() {
  let group = []
  for (let i = startYear; i <= endYear; i++) {
    for (let j = 1; j <= 12; j++) {
      group.push({ year: i, month: j })
    }
  }
  return group
}

function generateICSHeader() {
  return [
    "BEGIN:VCALENDAR",
    "PRODID:中国节日",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:中国节日",
    "X-WR-TIMEZONE:Asia/Shanghai",
    "X-APPLE-LANGUAGE:zh",
    "X-APPLE-REGION:CN",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Shanghai",
    "X-LIC-LOCATION:Asia/Shanghai",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:CST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
  ].join("\n")
}

function generateICSItem(dateString, title) {
  return [
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${dateString}`,
    `DTEND;VALUE=DATE:${dateString}`,
    `DTSTAMP:${dateString}T000001`,
    `UID:${getUID(dateString)}`,
    `CREATED:${dateString}T000001`,
    "DESCRIPTION:",
    `SUMMARY:${title}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
  ].join("\n")
}

function generateICSFooter() {
  return "END:VCALENDAR"
}

function getUID(dateString) {
  return `${dateString}${Math.ceil(Math.random() * 10000)}`
}