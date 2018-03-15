if (typeof require == 'function' ) var JsonRisk=require('../dist/json_risk.js');

var am=function(expr,msg){
        var m;
        if(!expr) {
                m="Failure: "+msg;
                console.log(m);
                if (typeof document != 'undefined') document.body.innerHTML+=(m+'</br>');
                if (typeof process != 'undefined' && typeof process.exit =='function' ) process.exit(1);
        }else{
                m="Success: "+msg;
                console.log(m);
                if (typeof document != 'undefined') document.body.innerHTML+=(m+'</br>');
        }
};

am (typeof JsonRisk.pricer == 'function', "pricer function defined");
am (typeof JsonRisk.pricer_bond == 'function', "pricer_bond function defined");
am (typeof JsonRisk.period_str_to_time == 'function', "period_str_to_time function defined");
am (typeof JsonRisk.date_str_to_date == 'function', "date_str_to_date function defined");
am (typeof JsonRisk.get_rate == 'function', "get_rate function defined");
am (typeof JsonRisk.get_fwd_amount == 'function', "get_fwd_amount function defined");
am (typeof JsonRisk.get_const_curve == 'function', "get_const_curve function defined");

/*!
	
	Test Year Fraction
	
*/
var from;
var to;
var yf;
var i;
yf=JsonRisk.year_fraction_factory("a/365");
for (i=1; i<11; i++){
        from=new Date(2000+i, 2*i, 3*i);
        to=JsonRisk.add_days(from,i*i);
        am((yf(from, to)*365).toFixed(10)===(i*i).toFixed(10), "Act/365 year fraction (" + i + ")");
}

yf=JsonRisk.year_fraction_factory("a/360");
for (i=1; i<11; i++){
        from=new Date(2000+i, 2*i, 3*i);
        to=JsonRisk.add_days(from,i*i);
        am((yf(from,to)*360).toFixed(10)===(i*i).toFixed(10), "Act/360 year fraction (" + i + ")");
}

yf=JsonRisk.year_fraction_factory("30E/360");
from=new Date(2000,0,1);
to = new Date(2001,0,1);
am(yf(from,to).toFixed(10)==1, "30E/360 year fraction (1)");    

from=new Date(2010,7,1);
to = new Date(2020,7,1);
am(yf(from,to).toFixed(10)==10, "30E/360 year fraction (2)");

from=new Date(2000,0,31);
to = new Date(2001,0,30);
am(yf(from,to).toFixed(10)==1, "30E/360 year fraction (3)");

from=new Date(2000,0,30);
to = new Date(2001,0,31);
am(yf(from,to).toFixed(10)==1, "30E/360 year fraction (4)");

from=new Date(2000,1,28);
to = new Date(2010,1,28);
am(yf(from,to).toFixed(10)==10, "30E/360 year fraction (5)");

yf=JsonRisk.year_fraction_factory("act/act");

from=new Date(2010,11,30);
to = new Date(2011,0,2);
am(yf(from,to).toFixed(10)===(3/365).toFixed(10), "act/act year fraction (1)");

from=new Date(2011,11,30);
to = new Date(2012,0,2);
am(yf(from,to).toFixed(10)===(2/365+1/366).toFixed(10), "act/act year fraction (2)");

from=new Date(2010,11,30);
to = new Date(2013,0,2);
am(yf(from,to).toFixed(10)===(367/365 + 1 + 1/365).toFixed(10), "act/act year fraction (3)");

yf=JsonRisk.year_fraction_factory("invalid string");
for (i=1; i<11; i++){
        from=new Date(2000+i,2*i,3*i);
        to=JsonRisk.add_days(from,i*i);
        am((yf(from,to)*365).toFixed(10)==(i*i).toFixed(10), "Undefined year fracion fallback to Act/365 (" + i + ")");
}

/*!
	
	Test month addition
	
*/
from=new Date(2000,1,25);
for (i=1; i<11; i++){
        am(JsonRisk.add_months(from,i*i).getTime()==new Date(2000,1+(i*i),25).getTime(),"Month addition (pos)");
        am(JsonRisk.add_months(from,-i*i).getTime()==new Date(2000,1-(i*i),25).getTime(),"Month addition (neg)");
}

from=new Date(2000,0,31);
for (i=1; i<4; i++){
        am(JsonRisk.add_months(from,2*i).getTime()==new Date(2000,2*i,31).getTime(),"Month addition (31st)");
        am(JsonRisk.add_months(from,2*i+5).getTime()==new Date(2000,2*i+5,31).getTime(),"Month addition (31st)");
        am(JsonRisk.add_months(from,12*i+1).getTime()==new Date(2000,12*i+1,28).getTime(),"Month addition (31st, Feb)");
}
am(JsonRisk.add_months(from,49).getTime()==new Date(2000,49,29).getTime(),"Month addition (31st, Feb, Leap Year)");

/*!
	
	Test holidays / calendar / adjustment
	
*/
cal=JsonRisk.is_holiday_factory("TARGET");

from=new Date(2000,0,1);
for (i=1; i<10; i++){
        from=JsonRisk.add_days(from,i*i);
        am(from.getTime()===JsonRisk.adjust(from,"unadjusted",cal).getTime(),"BDC unadjusted (" + i + ")");
}

from=new Date(2018,0,1); //Monday
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"following",cal).getTime(),"BDC following");
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"modified following",cal).getTime(),"BDC mod following");
am(JsonRisk.add_days(from,-3).getTime()==JsonRisk.adjust(from,"preceding",cal).getTime(),"BDC preceding");


from=new Date(2018,2,30);//Friday
am(JsonRisk.add_days(from,4).getTime()==JsonRisk.adjust(from,"following",cal).getTime(),"BDC following");
am(JsonRisk.add_days(from,-1).getTime()==JsonRisk.adjust(from,"modified following",cal).getTime(),"BDC mod following");
am(JsonRisk.add_days(from,-1).getTime()==JsonRisk.adjust(from,"preceding",cal).getTime(),"BDC preceding");


from=new Date(2018,3,2); //Monday (Ostermontag)
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"following",cal).getTime(),"BDC following");
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"modified following",cal).getTime(),"BDC mod following");
am(JsonRisk.add_days(from,-4).getTime()==JsonRisk.adjust(from,"preceding",cal).getTime(),"BDC preceding");

from=new Date(2018,4,1); //Tuesday
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"following",cal).getTime(),"BDC following");
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"modified following",cal).getTime(),"BDC mod following");
am(JsonRisk.add_days(from,-1).getTime()==JsonRisk.adjust(from,"preceding",cal).getTime(),"BDC preceding");

from=new Date(2018,11,25); //Tuesday
am(JsonRisk.add_days(from,2).getTime()==JsonRisk.adjust(from,"following",cal).getTime(),"BDC following");
am(JsonRisk.add_days(from,2).getTime()==JsonRisk.adjust(from,"modified following",cal).getTime(),"BDC mod following");
am(JsonRisk.add_days(from,-1).getTime()==JsonRisk.adjust(from,"preceding",cal).getTime(),"BDC preceding");

from=new Date(2018,11,26); //Wednesday
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"following",cal).getTime(),"BDC following");
am(JsonRisk.add_days(from,1).getTime()==JsonRisk.adjust(from,"modified following",cal).getTime(),"BDC mod following");
am(JsonRisk.add_days(from,-2).getTime()==JsonRisk.adjust(from,"preceding",cal).getTime(),"BDC preceding");

/*

        Period string conversion

*/
am(JsonRisk.period_str_to_time("1Y")===1, "Period string (1Y)");
am(JsonRisk.period_str_to_time("12y")===12, "Period string (12y)");
am(JsonRisk.period_str_to_time("999Y")===999, "Period string (999Y)");
am(JsonRisk.period_str_to_time("6M")===1/2, "Period string (6M)");
am(JsonRisk.period_str_to_time("12m")===1, "Period string (12m)");
am(JsonRisk.period_str_to_time("24M")===2, "Period string (24M)");
am(JsonRisk.period_str_to_time("365d")===1, "Period string (365d)");
am(JsonRisk.period_str_to_time("156w")===3, "Period string (156w)");

var foo="do not overwrite";
try{
        foo=JsonRisk.period_str_to_time("156r");
}catch(e){
        console.log("Expected error message: " + e.toString());
}
am(foo==="do not overwrite", "Period string (invalid period string)");


/*

        Date string conversion

*/

console.log(new Date(2018,1,28));
am(JsonRisk.date_str_to_date("28.2.2018").getTime()===new Date(2018,1,28).getTime(), "Date string (28.2.2018)");
am(JsonRisk.date_str_to_date("2018-2-28").getTime()===new Date(2018,1,28).getTime(), "Date string (2018-28-2)");
am(JsonRisk.date_str_to_date("2018-02-28").getTime()===new Date(2018,1,28).getTime(), "Date string (2018-28-02)");
am(JsonRisk.date_str_to_date("2018-03-31").getTime()===new Date(2018,2,31).getTime(), "Date string (2018-31-03)");
am(JsonRisk.date_str_to_date("31.12.1999").getTime()===new Date(1999,11,31).getTime(), "Date string (31.12.1999)");
am(JsonRisk.date_str_to_date("1.1.1999").getTime()===new Date(1999,0,1).getTime(), "Date string (1.1.1999)");

var foo="do not overwrite";
try{
        foo=JsonRisk.date_str_to_date("29.2.2018");
}catch(e){
        console.log("Expected error message: " + e.toString());
}
am(foo==="do not overwrite", "Period string (invalid period string)");

foo="do not overwrite";
try{
        foo=JsonRisk.date_str_to_date("32.1.2018");
}catch(e){
        console.log("Expected error message: " + e.toString());
}
am(foo==="do not overwrite", "Period string (invalid period string)");

foo="do not overwrite";
try{
        foo=JsonRisk.date_str_to_date("1.13.2099");
}catch(e){
        console.log("Expected error message: " + e.toString());
}
am(foo==="do not overwrite", "Period string (invalid period string)");


foo="do not overwrite";
try{
        foo=JsonRisk.date_str_to_date("11-131-2099");
}catch(e){
        console.log("Expected error message: " + e.toString());
}
am(foo==="do not overwrite", "Period string (invalid period string)");



/*!
	
	Test Curves
	
*/

//Curve with given times
var c={type: "yield", labels: ["1Y", "2Y", "3Y", "13Y"], times: [1,2,3,13], values: [0.01, 0.02, 0, 0.1]};
am ((0.013).toFixed(10) == JsonRisk.get_rate(c, 1.3).toFixed(10), "Yield Curve Interpolation (1)");
am ((0.015).toFixed(10) == JsonRisk.get_rate(c, 1.5).toFixed(10), "Yield Curve Interpolation (2)");
am ((0.017).toFixed(10) == JsonRisk.get_rate(c, 1.7).toFixed(10), "Yield Curve Interpolation (3)");
am ((0.01).toFixed(10) == JsonRisk.get_rate(c, 4).toFixed(10), "Yield Curve Interpolation (4)");
am ((0.03).toFixed(10) == JsonRisk.get_rate(c, 6).toFixed(10), "Yield Curve Interpolation (5)");
am ((0.05).toFixed(10) == JsonRisk.get_rate(c, 8).toFixed(10), "Yield Curve Interpolation (6)");
am ((0.07).toFixed(10) == JsonRisk.get_rate(c, 10).toFixed(10), "Yield Curve Interpolation (7)");
am ((0.09).toFixed(10) == JsonRisk.get_rate(c, 12).toFixed(10), "Yield Curve Interpolation (8)");

//Curve without times - fallback based on days
c={type: "yield", labels: ["1Y", "2Y", "3Y", "13Y"], days: [365, 2*365, 3*365, 13*365], values: [0.01, 0.02, 0, 0.1]};
am ((0.013).toFixed(10) == JsonRisk.get_rate(c, 1.3).toFixed(10), "Yield Curve Interpolation days only (1)");
am ((0.015).toFixed(10) == JsonRisk.get_rate(c, 1.5).toFixed(10), "Yield Curve Interpolation days only (2)");
am ((0.017).toFixed(10) == JsonRisk.get_rate(c, 1.7).toFixed(10), "Yield Curve Interpolation days only (3)");
am ((0.01).toFixed(10) == JsonRisk.get_rate(c, 4).toFixed(10), "Yield Curve Interpolation days only (4)");
am ((0.03).toFixed(10) == JsonRisk.get_rate(c, 6).toFixed(10), "Yield Curve Interpolation days only (5)");
am ((0.05).toFixed(10) == JsonRisk.get_rate(c, 8).toFixed(10), "Yield Curve Interpolation days only (6)");
am ((0.07).toFixed(10) == JsonRisk.get_rate(c, 10).toFixed(10), "Yield Curve Interpolation days only (7)");
am ((0.09).toFixed(10) == JsonRisk.get_rate(c, 12).toFixed(10), "Yield Curve Interpolation days only (8)");


//Curve without times - fallback based on dates
c={type: "yield", labels: ["0Y", "1Y", "2Y", "3Y", "13Y"], dates: ["01.01.2000", "31.12.2000", "31.12.2001", "31.12.2002", "28.12.2012"], values: [0, 0.01, 0.02, 0, 0.1]};
am ((0.013).toFixed(10) == JsonRisk.get_rate(c, 1.3).toFixed(10), "Yield Curve Interpolation dates only (1)");
am ((0.015).toFixed(10) == JsonRisk.get_rate(c, 1.5).toFixed(10), "Yield Curve Interpolation dates only (2)");
am ((0.017).toFixed(10) == JsonRisk.get_rate(c, 1.7).toFixed(10), "Yield Curve Interpolation dates only (3)");
am ((0.01).toFixed(10) == JsonRisk.get_rate(c, 4).toFixed(10), "Yield Curve Interpolation dates only (4)");
am ((0.03).toFixed(10) == JsonRisk.get_rate(c, 6).toFixed(10), "Yield Curve Interpolation dates only (5)");
am ((0.05).toFixed(10) == JsonRisk.get_rate(c, 8).toFixed(10), "Yield Curve Interpolation dates only (6)");
am ((0.07).toFixed(10) == JsonRisk.get_rate(c, 10).toFixed(10), "Yield Curve Interpolation dates only (7)");
am ((0.09).toFixed(10) == JsonRisk.get_rate(c, 12).toFixed(10), "Yield Curve Interpolation dates only (8)");

//Curve without times - fallback based on labels
c={type: "yield", labels: ["1Y", "2Y", "3Y", "13Y"],values: [0.01, 0.02, 0, 0.1]};
am ((0.013).toFixed(10) == JsonRisk.get_rate(c, 1.3).toFixed(10), "Yield Curve Interpolation labels only (1)");
am ((0.015).toFixed(10) == JsonRisk.get_rate(c, 1.5).toFixed(10), "Yield Curve Interpolation labels only (2)");
am ((0.017).toFixed(10) == JsonRisk.get_rate(c, 1.7).toFixed(10), "Yield Curve Interpolation labels only (3)");
am ((0.01).toFixed(10) == JsonRisk.get_rate(c, 4).toFixed(10), "Yield Curve Interpolation labels only (4)");
am ((0.03).toFixed(10) == JsonRisk.get_rate(c, 6).toFixed(10), "Yield Curve Interpolation labels only (5)");
am ((0.05).toFixed(10) == JsonRisk.get_rate(c, 8).toFixed(10), "Yield Curve Interpolation labels only (6)");
am ((0.07).toFixed(10) == JsonRisk.get_rate(c, 10).toFixed(10), "Yield Curve Interpolation labels only (7)");
am ((0.09).toFixed(10) == JsonRisk.get_rate(c, 12).toFixed(10), "Yield Curve Interpolation labels only (8)");

/*!
	
	Test Schedule
	
*/
var same_dates=function(sched, expected){
        var i;
        var fail=false;
        if (sched.length !== expected.length) fail=true;
        for (i=1;i<sched.length && (!fail);i++){
                if(!(sched[i] instanceof Date)) fail=true;
                if(!(expected[i] instanceof Date)) fail=true;
                if(sched[i].getTime()!==expected[i].getTime()) fail=true;
                if(fail) break;
        }
        if(!fail) return true;
        console.log("Generated schedule: " + sched);
        console.log("Expected schedule: " + expected);
        return false;
};

var expected=[
        new Date(1980,0,1),
        new Date(1981,0,1),
        new Date(1982,0,1),
        new Date(1983,0,1),
        new Date(1984,0,1)
];

var sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "unadjusted", null, null);
am (same_dates(sched, expected), "Backward schedule generation (1)");

sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "unadjusted", new Date(1981,0,1), new Date(1983,0,1));
am (same_dates(sched, expected), "Backward schedule generation (2)");

sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "unadjusted", new Date(1981,0,1), new Date(1984,0,1));
am (same_dates(sched, expected), "Backward schedule generation (3)");

sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "preceding", new Date(1981,0,1), new Date(1983,0,1));
am (same_dates(sched, expected), "Backward schedule generation (4)");


sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 12, JsonRisk.is_holiday_factory("Target"), "following", new Date(1980,0,2), new Date(1983,0,1));
am (same_dates(sched, expected), "Backward schedule generation with first date that is already adjusted (1)");

expected=[
        new Date(1980,0,1),
        new Date(1980,2,1), //first date
        new Date(1981,2,1),
        new Date(1982,2,1),
        new Date(1983,2,1), //next to last date
        new Date(1984,0,1)
];
sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "unadjusted", new Date(1980,2,1), new Date(1983,2,1));
am (same_dates(sched, expected), "Backward schedule generation (6)");

expected=[
        new Date(1980,0,1),
        new Date(1980,2,1), //first date
        new Date(1980,8,1),
        new Date(1981,2,1),
        new Date(1981,8,1),
        new Date(1982,2,1),
        new Date(1982,8,1),
        new Date(1983,2,1), //next to last date
        new Date(1984,0,1)
];
sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 6, JsonRisk.is_holiday_factory(""), "unadjusted", new Date(1980,2,1), new Date(1983,2,1));
am (same_dates(sched, expected), "Backward schedule generation (7)");

expected=[
        new Date(1980,0,1),
        new Date(1981,0,1),
        new Date(1982,0,1),
        new Date(1983,0,1),
        new Date(1984,0,1)
];
JsonRisk.valuation_date=new Date(1980,6,1);
sched=JsonRisk.backward_schedule(null, new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "unadjusted", null, null);
am (same_dates(sched, expected), "Backward schedule generation without effective date (1)");

sched=JsonRisk.backward_schedule(null, new Date(1984,0,1), 12, JsonRisk.is_holiday_factory(""), "unadjusted", null, new Date(1983,0,1));
am (same_dates(sched, expected), "Backward schedule generation without effective date (2)");

expected=[
        new Date(1980,3,1),
        new Date(1980,9,1),
        new Date(1981,3,1),
        new Date(1981,9,1),
        new Date(1982,3,1),
        new Date(1982,9,1),
        new Date(1983,3,1),
        new Date(1984,0,1)
];


sched=JsonRisk.backward_schedule(null, new Date(1984,0,1), 6, JsonRisk.is_holiday_factory(""), "unadjusted", null, new Date(1983,3,1));
am (same_dates(sched, expected), "Backward schedule generation without effective date (3)");

sched=JsonRisk.backward_schedule(new Date(1980,0,1), new Date(1984,0,1), 6, JsonRisk.is_holiday_factory(""), "unadjusted", new Date(1980,3,1), new Date(1983,3,1));
am (same_dates(sched, expected), "Backward schedule generation with first date just before valuation date (1)");

/*!
	
	Test bond Valuation
	
*/
var curve=JsonRisk.get_const_curve(0.05);
JsonRisk.valuation_date=new Date(2000,0,17);
var bond={
        maturity: "2010-01-18",
        notional: 100,
        fixed_rate: 0.05,
        freq: 12,
        bdc: "unadjusted"
};


am("105.0"==JsonRisk.bond_dirty_value(bond,curve, null, null).toFixed(1), "bond valuation (1)");

bond.settlement_days=1;

//console.log("bond DV: " + JsonRisk.bond_dirty_value(bond.curve, null, null));
am("100.0"==JsonRisk.bond_dirty_value(bond,curve, null, null).toFixed(1), "bond valuation (2)");

bond.freq=6;
am("100.5"==JsonRisk.bond_dirty_value(bond,curve, null, null).toFixed(1), "bond valuation (3)");

bond.freq=3;
am("100.7"==JsonRisk.bond_dirty_value(bond,curve, null, null).toFixed(1), "bond valuation (4)");

//reale bundesanleihen, kurse und renditen vom 23.02.2018
/*
Kupon	Bez	Mat	Kurs Clean	Rendite	Kurs Dirty
1.750	Bund 14	15.02.2024	109.338	0.18	109.396
1.500	Bund 14	15.05.2024	107.930	0.21	109.114
1.000	Bund 14	15.08.2024	104.830	0.25	105.367
0.500	Bund 15	15.02.2025	101.263	0.32	101.279
1.000	Bund 15	15.08.2025	104.602	0.37	105.139
0.500	Bund 16	15.02.2026	100.474	0.44	100.490
4.250	Bund 07	04.07.2039	158.385	1.15	161.156
4.750	Bund 08	04.07.2040	170.090	1.17	173.187
3.250	Bund 10	04.07.2042	142.125	1.24	144.244
2.500	Bund 12	04.07.2044	126.970	1.29	128.600
2.500	Bund 14	15.08.2046	128.220	1.31	129.562
1.250	Bund 17	15.08.2048	97.695	1.34	98.366
*/

var Kupon=[1.750,1.500,1.000,0.500,1.000,0.500,4.250,4.750,3.250,2.500,2.500,1.250];
var Maturity=["15.02.2024", "15.05.2024", "15.08.2024", "15.02.2025", "15.08.2025",
              "15.02.2026", "04.07.2039", "04.07.2040", "04.07.2042", "04.07.2044",
              "15.08.2046", "15.08.2048"];
var Kurs_Dirty=[109.396, 109.114, 105.367, 101.279, 105.139, 100.490,
                161.156, 173.187, 144.244, 128.600, 129.562, 98.366];
var Rendite=[0.18, 0.21, 0.25, 0.32, 0.37, 0.44, 1.15, 1.17,
             1.24, 1.29, 1.31, 1.34];

JsonRisk.valuation_date=new Date(2018,1,23);

var bonds=[];
for (i=0; i<Kupon.length; i++){
        bonds.push({
        maturity: Maturity[i],
        notional: 100.0,
        fixed_rate: Kupon[i]/100,
        freq: 12,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2
        });
}

var pu,pd;
//evaluate with yield curve
for (i=0; i<Kupon.length; i++){
        curve=JsonRisk.get_const_curve(Rendite[i]/100);
        curve_down=JsonRisk.get_const_curve(Rendite[i]/100-0.0001);
        curve_up=JsonRisk.get_const_curve(Rendite[i]/100+0.0001);
        pu=JsonRisk.bond_dirty_value(bonds[i],curve_up, null, null);
        pd=JsonRisk.bond_dirty_value(bonds[i],curve_down, null, null);
        console.log("JSON Risk Price one basis point cheaper:        " + pu.toFixed(3));    
        console.log("Quote from www.bundesbank.de:                   " + Kurs_Dirty[i].toFixed(3));
        console.log("JSON Risk Price one basis point more expensive: " + pd.toFixed(3));    

        am(pu<Kurs_Dirty[i] && Kurs_Dirty[i]<pd, "Bond Valuation (Real BUND Bonds using yield curve, " + (i+1) +")");
}
//evaluate with spread curve
for (i=0; i<Kupon.length; i++){
        curve=JsonRisk.get_const_curve(Rendite[i]/100);
        curve_down=JsonRisk.get_const_curve(Rendite[i]/100-0.0001);
        curve_up=JsonRisk.get_const_curve(Rendite[i]/100+0.0001);
        pu=JsonRisk.bond_dirty_value(bonds[i],null, curve_up, null);
        pd=JsonRisk.bond_dirty_value(bonds[i],null, curve_down, null);
        am(pu<Kurs_Dirty[i] && Kurs_Dirty[i]<pd, "Bond Valuation (Real BUND Bonds using spread curve, " + (i+1) +")");
}

//Real prices at interest payment date minus settlement days
JsonRisk.valuation_date=new Date(2018,0,2);

Kupon=[3.750, 4.000];
Maturity=["04.01.2019", "04.01.2037"];
Kurs_Dirty=[104.468, 152.420];
Rendite=[-0.69, 0.97];

bonds=[];
for (i=0; i<Kupon.length; i++){
        bonds.push({
        maturity: Maturity[i],
        notional: 100.0,
        fixed_rate: Kupon[i]/100,
        freq: 12,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2
        });
}

//evaluate with yield curve
for (i=0; i<Kupon.length; i++){
        curve=JsonRisk.get_const_curve(Rendite[i]/100);
        curve_down=JsonRisk.get_const_curve(Rendite[i]/100-0.0001);
        curve_up=JsonRisk.get_const_curve(Rendite[i]/100+0.0001);
        pu=JsonRisk.bond_dirty_value(bonds[i],curve_up, null, null);
        pd=JsonRisk.bond_dirty_value(bonds[i],curve_down, null, null);
        console.log("JSON Risk Price one basis point cheaper:        " + pu.toFixed(3));    
        console.log("Quote from www.bundesbank.de:                   " + Kurs_Dirty[i].toFixed(3));
        console.log("JSON Risk Price one basis point more expensive: " + pd.toFixed(3));    
       
        am(pu<Kurs_Dirty[i] && Kurs_Dirty[i]<pd, "Bond Valuation (Real BUND Bonds at interest payment date minus settlement days, " + (i+1) +")");
}


//Real prices before interest payment date minus settlement
JsonRisk.valuation_date=new Date(2017,11,31);

Kurs_Dirty=[108.230, 157.199];
Rendite=[-0.70, 0.93];

//evaluate with yield curve
for (i=0; i<Kupon.length; i++){
        curve=JsonRisk.get_const_curve(Rendite[i]/100);
        curve_down=JsonRisk.get_const_curve(Rendite[i]/100-0.0001);
        curve_up=JsonRisk.get_const_curve(Rendite[i]/100+0.0001);
        pu=JsonRisk.bond_dirty_value(bonds[i],curve_up, null, null);
        pd=JsonRisk.bond_dirty_value(bonds[i],curve_down, null, null);
        console.log("JSON Risk Price one basis point cheaper:        " + pu.toFixed(3));    
        console.log("Quote from www.bundesbank.de:                   " + Kurs_Dirty[i].toFixed(3));
        console.log("JSON Risk Price one basis point more expensive: " + pd.toFixed(3));    
       
        am(pu<Kurs_Dirty[i] && Kurs_Dirty[i]<pd, "Bond Valuation (Real BUND Bonds just before interest payment date minus settlement days, " + (i+1) +")");
}