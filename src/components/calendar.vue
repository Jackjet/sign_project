<template>
    <div class='calendar'>
        <div class='input-wrapper' v-show='showInput'>
            <!--<i class='date-icon' :style='setIconUrl'></i>-->
            <div class='input' v-text='value' :style='{width: inputWidth}' @click='togglePanel = !togglePanel'></div>
            <span class='input-clear icon-close' v-show="value" @click='clearValue'></span>
            <!-- <span class='input-icon icon-calendar' v-show="!value" @click='togglePanel = !togglePanel'></span> -->
            <span class='input-icon icon-calendar'  v-show="!value" @click='togglePanel = !togglePanel'></span>
        </div>
        <transition name='toggle'>
            <div class='pannel-wrapper' :style='themePannelBg' v-show='togglePanel'>
                <div class='pannel-header' :style='themeHeaderBg'>
                    <span class='year' :style='themeHeaderYear' v-text='tmpYear' @click='showYearPannel'></span><span :style='themeHeaderSep'>/</span><span class='month' :style='themeHeaderMonth' v-text='tmpMonth + 1' @click='showMonthPannel'></span>
                    <span class='prev' @click='prevMonth' :style='themeLeftArrow' v-show='pannelType !== "month"'>&lt;</span>
                    <span class='next' @click='nextMonth' :style='themeRightArrow' v-show='pannelType !== "month"'>&gt;</span>
                </div>
                <div class='year-list' v-show='pannelType === "year"'>
                    <ul class='month-wrapper'>
                        <li v-for='item in yearList' :class="{selected: isSelected(item, 'year')}" @click='selectYear(item)'>{{item}}</li>
                    </ul>
                </div>
                <div class='month-list' v-show='pannelType === "month"'>
                    <ul class='month-wrapper'>
                        <li v-for='item in monthList' :class="{selected: isSelected(item, 'month')}" @click='selectMonth(item)'>{{month(item, lang)}}</li>
                    </ul>
                </div>
                <div class='date-list' v-show='pannelType === "date"'>
                    <ul class='week'>
                        <li v-for='item in weekList' :style='themeWeekColor'>{{week(item, lang)}}</li>
                    </ul>
                    <ul class='date'>
                        <li v-for='item in dateList' :class="{selected: isSelected(item, 'date'), 'notCurMonth': !item.isCurMonth, unvalid: !validDate(item), unvalidBig: !validDateBig(item)}" @click='selectDate(item)' :style='setSeltheme(item, "date")'>{{item.value}}</li>
                    </ul>
                    <div class='time' v-show='type === "time"'>
                        <input type='text' v-model='startHour' @focus='checkTime("startHour")' @blur='clearCheck'/> : <input type='text' v-model='startMin'  @focus='checkTime("startMin")' @blur='clearCheck'/> - <input type='text' v-model='endHour'  @focus='checkTime("endHour")' @blur='clearCheck'/> : <input type='text' v-model='endMin'  @focus='checkTime("endMin")' @blur='clearCheck'/>
                    </div>
                </div>
                <div class='group-btn'>
                    <button type='button' class='btn btn-confirm' @click='confirmSelect' :style='themeBtnCon'>确认</button>
                    <button type='button' class='btn btn-cancle' @click='cancleSelect' :style='themeBtnCan'>取消</button>
                </div>
            </div>
        </transition>
        <alertModel :title="'提示'" :context="'请选择一个日期'" :type="1"  :showState="showAlertState"  v-show="showAlertState"  @cancelHandle="showAlertState = false" >
    </alertModel>
    </div>
</template>

<script>
    export default {
        data() {
            let curDate = new Date();
            /**
             * param {String} value: 已选日期
             * param {Boolean} togglePanel: 是否展示日期选择框
             * param {String} pannelType: 当前日期选择类型（年、月、日） 
             * param {Date} curYear: 当日年份
             * param {Date} curMonth: 当日月份
             * param {Date} curMonth: 当日日期
             * param {Date} tmpYear: 已点击年份
             * param {Date} tmpMonth: 已点击月份
             * param {Date} tmpDate: 已点击日期
             * param {Date} startYear: 已选择日期开始年份
             * param {Date} startMonth: 已选择日期开始月份
             * param {Date} startDate: 已选择日期开始日期
             * param {Date} endYear: 已选择日期结束年份
             * param {Date} endMonth: 已选择日期结束月份
             * param {Date} endDate: 已选择日期结束日期
             * param {String} startHour: 日期开始时
             * param {String} startMin: 日期开始分
             * param {String} endHour: 日期结束时
             * param {String} endMin: 日期结束分
             * param {Number} page: 年份选择，更新年份
             * param {String} lang: 日期语言，'zh','en'
             * param {String} format: 日期分隔符
             * param {Array} weekList: 周列表
             * param {Array} monthList: 月列表
             * param {Boolean} flag: type 为 'range' 时，日期范围点击判断
             * param {Boolean} check: type 为 'range' 时，检查输入时间是否合法
            */
            return {
                showAlertState:false,
                value: '',
                togglePanel: false,
                pannelType: 'date',
                curYear: curDate.getFullYear(),
                curMonth: curDate.getMonth(),
                curDate: curDate.getDate(),
                tmpYear: curDate.getFullYear(),
                tmpMonth: curDate.getMonth(),
                tmpDate: curDate.getDate(),
                startYear: curDate.getFullYear(),
                startMonth: curDate.getMonth(),
                startDate: curDate.getDate(),
                endYear: curDate.getFullYear(),
                endMonth: curDate.getMonth(),
                endDate: curDate.getDate(),
                startHour: '0',
                startMin: '0',
                endHour: '23',
                endMin: '59',
                page: 0,
                lang: 'zh',
                format: '-',
                weekList: [0, 1, 2, 3, 4, 5, 6],
                monthList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                flag: true,
                check: '',
                clickOne:true,
                closeNum:0
            }
        },
        props: {
            val:{          //默认显示值
                type:String,
                default:"2"
            },
            msg:{
                type:Object,
                default:Object
            },
            type: {
                type: String,
                default: 'single'            //range/time
            },
            isAbandon: {
                type: Boolean,
                default: false    //早于系统日期的日期选项是否不可选
            },
			isBogdon: {
                type: Boolean,
                default: true    //大于系统日期的日期选项是否不可选
            },
            showInput: {
                type: Boolean,
                default: true
            },
            inputwidth: {
                type: String,
                default: ''
            },
            theme: {
                type: String,
                default: '#e57373'
            },
            themepannelbg: {
                type: String,
                default: '#fff'
            },
            themeheadercolor: {
                type: String,
                default: '#fff'
            },
            themeheaderyear: {
                type: String,
                default: ''
            },
            themeheadermonth: {
                type: String,
                default: ''
            },
            themeheadersep: {
                type: String,
                default: ''
            },
            themeleftarrow: {
                type: String,
                default: ''
            },
            themerightarrow: {
                type: String,
                default: ''
            },
            themeheaderbg: {
                type: String,
                default: ''
            },
            themeweekcolor: {
                type: String,
                default: ''
            },
            themeborder: {
                type: String,
                default: ''
            },
            themeselbg: {
                type: String,
                default: ''
            },
            themeselcolor: {
                type:String,
                default: '#fff',
            },
            themebtnborder: {
                type: String,
                default: ''
            },
            themebtnconbg: {
                type: String,
                default: ''
            },
            themebtncanbg: {
                type: String,
                default: '#fff'
            },
            themebtnconfirmcolor: {
                type: String,
                default: '#fff'
            },
            themebtncanclecolor: {
                type: String,
                default: '#000'
            },
            themecurmonthcolor: {
                type: String,
                default: '#000'
            },
            themeprevmonthcolor: {
                type: String,
                default: '#aaa'
            },
            themenextmonthcolor: {
                type: String,
                default: '#aaa'
            },
            themenotallowcolor: {
                type: String,
                default: '#aaa'
            }
        },
        created() {  //初始化
            this.changeValue();            
        },
        methods: {
            showYearPannel() {
                this.pannelType = 'year';
            },
            showMonthPannel() {
                this.pannelType = 'month';
            },
            isSelected(item, type) {
                switch(type) {
                    case 'year':
                        return item === this.tmpYear;
                    case 'month':
                        return item === this.tmpMonth;
                    case 'date':
                        let mon = this.tmpMonth;
                        let time;
                        item.isPrevMonth && mon--;
                        item.isNextMonth && mon++;
                        time = new Date(this.tmpYear, mon, item.value).getTime()
                        return time >= new Date(this.startYear, this.startMonth, this.startDate).getTime() && time <= new Date(this.endYear, this.endMonth, this.endDate).getTime();
                }
            },
            month(item, lang) {
                switch (lang) {
                    case 'en':
                        return {0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'}[item]
                    case 'zh':
                        return {0: '一', 1: '二', 2: '三', 3: '四', 4: '五', 5: '六', 6: '七', 7: '八', 8: '九', 9: '十', 10: '十一', 11: '十二'}[item]
                    default:
                        return item
                }
            },
            week(item, lang) {
                switch (lang) {
                    case 'en':
                        return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
                    case 'zh':
                        return {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'}[item]
                    default:
                        return item
                }
            },
            validDate(item) {
                if(this.isAbandon) {
                    let mon = item.isCurMonth ? this.tmpMonth : (item.isPrevMonth ? this.tmpMonth - 1 : this.tmpMonth + 1);
                    return new Date(this.tmpYear, mon, item.value).getTime() >= new Date(this.curYear, this.curMonth, this.curDate).getTime()
                }
                return true;
            },
			validDateBig(item) {
                if(this.isBogdon) {
                    let mon = item.isCurMonth ? this.tmpMonth : (item.isPrevMonth ? this.tmpMonth - 1 : this.tmpMonth + 1);
                    return new Date(this.tmpYear, mon, item.value).getTime() <= new Date(this.curYear, this.curMonth, this.curDate).getTime()
                }
                return true;
            },
            selectYear(item) {
                this.tmpYear = item;
            },
            selectMonth(item) {
                this.tmpMonth = item;
            },
            selectDate(item){
                if(!this.validDate(item)) return;
                if(!this.validDateBig(item)) return;
                //是否修改月份
                item.isPrevMonth ? (this.tmpMonth === 0 ? (--this.tmpYear,this.tmpMonth = 11) : --this.tmpMonth) : (item.isNextMonth ? (this.tmpMonth === 11 ? (++this.tmpYear, this.tmpMonth = 0) : ++this.tmpMonth) : (this.tmpYear, this.tmpMonth));
                switch(this.type) {
                    case 'single':  //console.log(123)
                    case 'time':
                        this.startDate = this.endDate = item.value;
                        this.startMonth = this.endMonth = this.tmpMonth;
                        this.startYear = this.endYear = this.tmpYear;
                        break;
                    case 'range':
                        if(this.startYear && this.startMonth && this.startDate && this.endYear && this.endMonth && this.endDate) {
                            let selTime = new Date(this.tmpYear, this.tmpMonth, item.value).getTime(),
                                startTime = new Date(this.startYear, this.startMonth, this.startDate).getTime(),
                                endTime = new Date(this.endYear, this.endMonth, this.endDate).getTime();
                            
                            if(selTime < startTime) {
                                this.startYear = this.tmpYear;
                                this.startMonth = this.tmpMonth;
                                this.startDate = item.value;
                                this.flag = true;
                            }else if(selTime > endTime) {
                                this.endYear = this.tmpYear;
                                this.endMonth = this.tmpMonth;
                                this.endDate = item.value;
                                this.flag = false;
                            }else if (selTime > startTime && selTime < endTime) {
                                this.flag ? (this.startYear = this.tmpYear, this.startMonth = this.tmpMonth, this.startDate = item.value) : (this.endYear = this.tmpYear, this.endMonth = this.tmpMonth, this.endDate = item.value);
                            }
                        }else {
                            this.startDate = this.endDate = item.value;
                            this.startMonth = this.endMonth = this.tmpMonth;
                            this.startYear = this.endYear = this.tmpYear;
                        }
                        break;
                    default:
                        this.value = '';
                }
            },
            prevMonth() {
                if(this.pannelType === 'date') {
                    this.tmpMonth === 0 ? (--this.tmpYear,this.tmpMonth = 11) : --this.tmpMonth;
                }else if(this.pannelType === 'year') {
                    --this.page;
                }
            },
            nextMonth() {
                if(this.pannelType === 'date') {
                    this.tmpMonth === 11 ? (++this.tmpYear, this.tmpMonth = 0) : ++this.tmpMonth;
                }else if(this.pannelType === 'year') {
                    ++this.page;
                }
            },
            changeValue() {
                switch(this.type) {
                    case 'single':
                        //this.value = `${this.startYear}${this.format}${this.startMonth + 1}${this.format}${this.startDate}`;

                        var month = null;
                        var datatime = null ;

                        if((this.startMonth+1) < 10){
                             month = '0'+ (this.startMonth+1)
                        }else{
                            month = (this.startMonth+1)
                        }
                        if(this.startDate < 10){
                            datatime = '0'+ (this.startDate);
                        }else{
                            datatime = this.startDate;
                        }


                        if(this.clickOne){
                            if(this.val == 1){
                                this.value = this.getDataFn().formatwdate;
                                this.clickOne = false;
                            }else{       
                                this.value = `${this.startYear}${this.format}${month}${this.format}${datatime}`;
                            }
                        }else{
                            this.value = `${this.startYear}${this.format}${month}${this.format}${datatime}`;
                        }
                       /* if(this.val == 1 && clickOne){
                            this.value = this.getDataFn().formatwdate;
                        }else{
                            this.value = `${this.startYear}${this.format}${this.startMonth + 1}${this.format}${this.startDate}`;
                        }*/
                        break;
                    case 'range':
                        this.value = `${this.startYear}${this.format}${this.startMonth + 1}${this.format}${this.startDate} -- ${this.endYear}${this.format}${this.endMonth + 1}${this.format}${this.endDate}`;
                        break;
                    case 'time':
                        let date = `${this.startYear}${this.format}${this.startMonth + 1}${this.format}${this.startDate}`;
                        this.startHour = this.startHour > 9 ? this.startHour : '0' + this.startHour * 1;
                        this.startMin = this.startMin > 9 ? this.startMin : '0' + this.startMin * 1;
                        this.endHour = this.endHour > 9 ? this.endHour : '0' + this.endHour * 1;
                        this.endMin = this.endMin > 9 ? this.endMin : '0' + this.endMin * 1;
                        this.value = `${date} ${this.startHour}:${this.startMin} - ${this.endHour}:${this.endMin}`;
                        break;
                    default:
                        this.value = '';
                }
                this.getValue();
                this.getStartTime();
                this.getEndTime();
				//console.log(this.value);
				this.$emit("changeDate",this.value);  //告知父级我的日期变更了
            },
            clearValue() {
                this.value = '';
                this.startYear = this.startMonth = this.startDate = this.endYear = this.endMonth = this.endDate = '';  
                if(this.msg.number){
                    this.msg.number = Math.random();
                }          
            },
            confirmSelect() {			
                if(this.pannelType === 'year') {
                    this.pannelType = 'month';
                }else if(this.pannelType === 'month'){
                    this.pannelType = 'date';
                    this.startYear = this.startMonth = this.startDate = this.endYear = this.endMonth = this.endDate = '';
                }else {
                    if(this.endHour < this.startHour) {
                        this.endHour = this.startHour;
                    }else if(this.endHour == this.startHour && this.endMin < this.startMin) {
                        this.endMin = this.startMin;
                    }
					if(this.startYear == ""){
                        this.showAlertState = true;
                        return false;
                    }
                    this.changeValue();
                    this.togglePanel = !this.togglePanel;
                }
            },
            cancleSelect() {
                this.togglePanel = !this.togglePanel;
                this.pannelType = 'date';
                this.tmpYear = this.startYear = this.endYear = this.curYear;
                this.tmpMonth = this.startMonth = this.endMonth = this.curMonth;
                this.tmpDate = this.startDate = this.endDate = this.curDate;
                this.startHour = '0';
                this.startMin = '0';
                this.endHour = '23';
                this.endMin = '59';
            },
            setSeltheme(item, type) {
                if(!this.validDate(item) || !this.validDateBig(item)) {
                    return `color:${this.themenotallowcolor}`;
                }else if(this.isSelected(item, type)) {
                    let bg = this.themeselbg ? this.themeselbg : this.theme;
                    return `backgroundColor:${bg};color:${this.themeselcolor}`;
                }else {
                    if(item.isCurMonth) {
                        return `color:${this.themecurmonthcolor}`;
                    }else if(item.isPrevMonth) {
                        return `color:${this.themeprevmonthcolor}`;
                    }else {
                        return `color:${this.themenextmonthcolor}`;
                    }
                }
            },
            checkTime(type){
                let self = this;
                this.check = setInterval(function() {
                    switch(type) {
                        case 'startHour':
                        case 'endHour':
                            self[type] = self[type] > 23 ? 23 : (self[type] > 0 ? self[type] * 1 : 0); 
                            break;
                        case 'startMin':
                        case 'endMin':
                            self[type] = self[type] > 59 ? 59 : (self[type] > 0 ? self[type] * 1 : 0); 
                            break;
                    }
                }, 500)
            },
            clearCheck() {
                let self = this;
                clearInterval(self.check);
            },
            getValue() {
                this.$emit('getValue', this.value);
            },
            getStartTime() {
                this.$emit('getStartTime', `${this.startYear}-${this.startMonth + 1}-${this.startDate} ${this.startHour}:${this.startMin}`);
            },
            getEndTime() {
                this.$emit('getEndTime', `${this.endYear}-${this.endMonth + 1}-${this.endDate} ${this.endHour}:${this.endMin}`);
            }
        },
        computed: {
            yearList() {
                return Array.from({length: 12}, (val, index) => {
                    return this.curYear + index + 12 * this.page;
                })
            },
            dateList() {
                let tmpMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate();
                let dateList = Array.from({length: tmpMonthLength}, (val, index) => {
                        return {
                            isCurMonth: true,
                            value: index + 1
                        }
                    });
                let firstDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay();
                let lastMonthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate();
                let len,
                    i;
                for(i = lastMonthLength; i > lastMonthLength - firstDay; --i) {
                    dateList.unshift({
                        isPrevMonth: true,
                        value: i
                    })
                }
                for(i = 0, len = dateList.length; i + len < 42; ++i) {
                    dateList.push({
                        isNextMonth: true,
                        value: i + 1
                    })
                }
                return dateList;
            },
            // setIconUrl() {
            //     if(/.(?:jpeg|jpg|png|svg)/i.test(this.iconUrl)){
            //         return `background-image: url(${this.iconUrl})`;
            //     }else {
            //         return '';
            //     }
            // },
            inputWidth() {
                return /(?:px|%|vh|vw|vmin|vmax)/.test(this.inputwidth) ? this.inputwidth : '';
            },
            themePannelBg() {
                return {
                    borderBottom: this.themeborder ? this.themeborder : `1px solid ${this.theme}`,
                    backgroundColor: this.themepannelbg
                }
            },
            themeHeaderBg() {
                return {
                    backgroundColor: this.themeheaderbg ? this.themeheaderbg : this.theme
                }
            },
            themeHeaderYear() {
                return {
                    color: this.themeheaderyear ? this.themeheaderyear : this.themeheadercolor
                }
            },
            themeHeaderMonth() {
                return {
                    color: this.themeheadermonth ? this.themeheadermonth : this.themeheadercolor
                }
            },
            themeHeaderSep() {
                return {
                    color: this.themeheadersep ? this.themeheadersep : this.themeheadercolor
                }
            },
            themeLeftArrow() {
                return {
                    color: this.themeleftarrow ? this.themeleftarrow : this.themeheadercolor
                }
            },
            themeRightArrow() {
                return {
                    color: this.themerightarrow ? this.themerightarrow : this.themeheadercolor
                }
            },
            themeWeekColor() {
                return {
                    color: this.themeweekcolor ? this.themeweekcolor : this.theme
                }
            },
            themeBtnCon() {
                return {
                    border: this.themebtnborder ? this.themebtnborder : `1px solid ${this.theme}`,
                    color: this.themebtnconfirmcolor,
                    backgroundColor: this.themebtnconbg ? this.themebtnconbg : this.theme
                }
            },
            themeBtnCan() {
                return {
                    border: this.themebtnborder ? this.themebtnborder : `1px solid ${this.theme}`,
                    color: this.themebtncanclecolor,
                    backgroundColor: this.themebtncanbg ? this.themebtncanbg : this.theme
                }
            }
        },
        mounted(){
            this.Event2.$on('tip',function(a){
                this.clearValue();
            }.bind(this));
        }

    }
</script>

<style scoped>
    .calendar {
  width:100%;
}
.select-wrapper {
  margin-left: 300px;
}
input[type='number'] {
  width: 30px;
}
input,
select {
  outline: none;
}
label {
  display: inline-block;
  width: 200px;
}
.group {
  margin: 10px 0;
}
.calendar {
  position: relative;
}
.calendar ul {
  padding: 0;
  margin: 0;
}
.calendar li {
  display: inline-block;
  list-style: none;
}
.calendar .input-wrapper {
  position: relative;
  display: inline-block;
  width:100%;
}
.calendar .input {
  width: 100%;
  height: 30px;
  text-indent:10px;
  text-align: left;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
}
.calendar .input-clear {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 25px;
  color: #aaaaaa;
}
.calendar .input-icon{
	position: absolute;
    top: 0px;
    right: 6px;
	color:#ccc;
}
/*.calendar .input-clear:before,
.calendar .input-clear:after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  content: '';
  background: #aaa;
}
.calendar .input-clear:before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.calendar .input-clear:after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}*/
.calendar .pannel-wrapper {
  position: absolute;
  top: 35px;
  left: 0;
  width: 259px;
  margin-top: 5px;
  background: #fff;
  z-index: 9;
  padding:10px;
  border-bottom:0 !important;
}
.calendar .pannel-header {
  position: relative;
  ((null)): 0;
  ((null)): 0;
  padding: 3px;
  margin-bottom: 10px;
  color: #fff;
  text-align: center;
  font-size: 1.5em;
  background-color: #e57373;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
}
.calendar .year,
.calendar .month {
  display: inline-block;
  margin: 0 5px;
  cursor: pointer;
}
.calendar .prev,
.calendar .next {
  position: absolute;
  top: 2px;
  ((null)): 0;
  cursor: pointer;
}
.calendar .prev {
  left: 10px;
}
.calendar .next {
  right: 10px;
}
.calendar .month-wrapper {
  width: 157.5px;
  margin: 0 auto;
}
.calendar .month-wrapper li {
  width: 52.5px;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
}
.calendar .date-list li {
  width: 35px;
  margin: 1px;
  text-align: center;
  font-size: 1em;
  cursor: default;
}
.calendar .week {
  margin-bottom: 5px;
}
.calendar .week li {
  color: #e57373;
  font-weight: bold;
}
.calendar .date li {
  height: 35px;
  color: #000;
  line-height: 35px;
  cursor: pointer;
}
.calendar .date .notCurMonth,
.calendar .date .unvalid {
  color: #aaa;
}
.calendar .date .unvalid {
  cursor: not-allowed;
}
.calendar .date .unvalidBig {
  cursor: not-allowed;
}
.calendar .time {
  margin: 10px 0 15px;
  text-align: center;
}
.calendar .time input {
  width: 30px;
  outline: none;
  text-align: center;
}
.calendar li.selected {
  color: #fff;
  background-color: #e57373;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}
.calendar .group-btn {
  margin: 10px 0 0;
  text-align: center;
  background:#efefef;
  padding:10px 0;
}
.calendar .btn {
  padding: 5px 15px;
  margin: 0 15px;
  border: 1px solid #e57373;
  outline: none;
  font-size: 16px;
  background: #fff;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
}
.calendar .btn-cancle{
	border:1px #dedede solid !important;
}
.calendar .btn-confirm {
  color: #fff;
  background: #e57373;
}
.calendar .btn-cancle {
  color: #000;
  background: #fff;
}
.calendar .toggle-enter-active,
.calendar .toggle-leave-active {
  transition: opacity 0.5s, translateY 0.5s;
}
.calendar .toggle-enter,
.calendar .toggle-leave-active {
  opacity: 0;
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
}
</style>