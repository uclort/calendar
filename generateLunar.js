const configGroup = [
  {
    icsFileName: "calendar",
    icsName: "农历_公农历节日_节气",
    type: {
      // 生成农历
      lunar: true,
      // 公历 返回节日的数组，包括元旦节、国庆节等，也包括母亲节、父亲节、感恩节、圣诞节等，有可能同一天有多个，也可能没有。
      solarFestivals: true,
      // 公历 返回其他纪念日的数组，例如世界抗癌日、香港回归纪念日等，有可能同一天有多个，也可能没有。
      solarOtherFestivals: true,
      // 返回常用节日的数组，包括春节、中秋、元宵等，有可能同一天有多个，也可能没有。
      lunarFestivals: true,
      // 返回其他传统节日的数组，包括寒衣节、下元节、祭灶日等，有可能同一天有多个，也可能没有。
      lunarOtherFestivals: true,
      // 返回二十四节气包括十二节（立春、惊蛰、清明、立夏、芒种、小暑、立秋、白露、寒露、立冬、大雪、小寒）和十二气（雨水、春分、谷雨、小满、夏至、大暑、处暑、秋分、霜降、小雪、冬至、大寒）
      jieQi: true,
    }
  },
  {
    icsFileName: "lunar",
    icsName: "中国农历",
    type: {
      // 生成农历
      lunar: true,
    }
  },
  {
    icsFileName: "solarFestivals",
    icsName: "公历节日",
    type: {
      // 公历 返回节日的数组，包括元旦节、国庆节等，也包括母亲节、父亲节、感恩节、圣诞节等，有可能同一天有多个，也可能没有。
      solarFestivals: true,
    }
  },
  {
    icsFileName: "solarOtherFestivals",
    icsName: "公历节日(补充)",
    type: {
      // 公历 返回其他纪念日的数组，例如世界抗癌日、香港回归纪念日等，有可能同一天有多个，也可能没有。
      solarOtherFestivals: true,
    }
  },
  {
    icsFileName: "lunarFestivals",
    icsName: "农历节日",
    type: {
      // 返回常用节日的数组，包括春节、中秋、元宵等，有可能同一天有多个，也可能没有。
      lunarFestivals: true,
    }
  },
  {
    icsFileName: "lunarOtherFestivals",
    icsName: "农历节日(补充)",
    type: {
      // 返回其他传统节日的数组，包括寒衣节、下元节、祭灶日等，有可能同一天有多个，也可能没有。
      lunarOtherFestivals: true,
    }
  },
  {
    icsFileName: "jieQi",
    icsName: "农历节气",
    type: {
      // 返回二十四节气包括十二节（立春、惊蛰、清明、立夏、芒种、小暑、立秋、白露、寒露、立冬、大雪、小寒）和十二气（雨水、春分、谷雨、小满、夏至、大暑、处暑、秋分、霜降、小雪、冬至、大寒）
      jieQi: true,
    }
  },
]

const { SolarMonth } = require('./1.7.6/lunar.js')
const fs = require('fs')

const startYear = 2000
const endYear = 2050

configGroup.forEach(item => {
  begin(item.icsFileName, item.icsName, item.type)
})

function begin(fileName, icsName, config) {
  let result = []
  result.push(generateICSHeader(icsName))
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
      // 公历当前日期的节日
      let solarFestivals = day.getFestivals()
      // 公里当前日期的其他节日
      let solarOtherFestivals = day.getOtherFestivals()
      // 公历当前日期对应的农历
      let lunar = day.getLunar()
      // 农历当前月对应的中文
      let monthChinese = lunar.getMonthInChinese().toString()
      // 农历当前日对应的中文
      let dayChinese = lunar.getDayInChinese().toString()
      // 农历当前日期的节日
      let lunarFestivals = lunar.getFestivals()
      // 农历当前日期的其他节日
      let lunarOtherFestivals = lunar.getOtherFestivals()
      // 农历当前日期
      let lunarDate = `${monthChinese}月${dayChinese}`
      // 节气
      let lunarJieQi = lunar.getJieQi()
      // console.log(`${solarDate} -> ${lunarDate}`)
      // console.log("公历节日 -> " + solarFestivals)
      // console.log("公历其他节日 -> " + solarOtherFestivals)
      // console.log("农历节日 -> " + lunarFestivals)
      // console.log("农历其他节日 -> " + lunarOtherFestivals)
      // console.log("---------------------------------")
      if (config.lunar) {
        result.push(generateICSItem(solarDate, lunarDate))
      }
      if (config.solarFestivals) {
        solarFestivals.forEach(festival => {
          result.push(generateICSItem(solarDate, festival))
        })
      }
      if (config.solarOtherFestivals) {
        solarOtherFestivals.forEach(festival => {
          result.push(generateICSItem(solarDate, festival))
        })
      }
      if (config.lunarFestivals) {
        lunarFestivals.forEach(festival => {
          result.push(generateICSItem(solarDate, festival))
        })
      }
      if (config.lunarOtherFestivals) {
        lunarOtherFestivals.forEach(festival => {
          result.push(generateICSItem(solarDate, festival))
        })
      }
      if (config.jieQi) {
        if (!!lunarJieQi) {
          result.push(generateICSItem(solarDate, lunarJieQi))
        }
      }
    }
  })
  result.push(generateICSFooter())

  const resultString = result.join("\n")
  // console.log(resultString)

  fs.writeFile(`./${fileName}.ics`, resultString, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`${fileName} -> 写入成功`)
  })
}

function getYearMonth() {
  let group = []
  for (let i = startYear; i <= endYear; i++) {
    for (let j = 1; j <= 12; j++) {
      group.push({ year: i, month: j })
    }
  }
  return group
}

function generateICSHeader(icsName) {
  return [
    "BEGIN:VCALENDAR",
    `PRODID:${icsName}`,
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsName}`,
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