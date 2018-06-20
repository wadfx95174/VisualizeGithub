
package leaderboard;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Calendar;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class LeaderboardContextListener implements ServletContextListener{
	Timer timer;
	private ArrayList<Leaderboard> starinWeekleaderboards = new ArrayList<Leaderboard>();
	private ArrayList<Leaderboard> starinMonthleaderboards = new ArrayList<Leaderboard>();
	private ArrayList<Leaderboard> starinHalfYearleaderboards = new ArrayList<Leaderboard>();
	private ArrayList<Leaderboard> starinYearleaderboards = new ArrayList<Leaderboard>();
	
	private ArrayList<Leaderboard> forkinWeekleaderboards = new ArrayList<Leaderboard>();
	private ArrayList<Leaderboard> forkinMonthleaderboards = new ArrayList<Leaderboard>();
	private ArrayList<Leaderboard> forkinHalfYearleaderboards = new ArrayList<Leaderboard>();
	private ArrayList<Leaderboard> forkinYearleaderboards = new ArrayList<Leaderboard>();
	
	private ArrayList<Leaderboard> followleaderboards = new ArrayList<Leaderboard>();
	public LeaderboardContextListener() {}
	
	public void contextInitialized(ServletContextEvent event) {
		ServletContext sc = event.getServletContext();
		CalculateLeaderboard cl = new CalculateLeaderboard();
		String inWeek,inMonth,inHalfYear,inYear;
		Calendar ca = Calendar.getInstance();//得到一个Calendar的实例  
		
		ca.setTime(new Date());   //设置时间为当前时间  
		ca.add(Calendar.YEAR, -1); //年份减1  
		Date lastYear = ca.getTime(); //结果  
		inYear = checkDate(lastYear.getYear()+1900,lastYear.getMonth()+1,lastYear.getDate());
		
		ca.setTime(new Date());
		ca.add(Calendar.MONTH, -6); //年份减1  
		Date lastSixMonth = ca.getTime(); //结果  
		inHalfYear = checkDate(lastSixMonth.getYear()+1900,lastSixMonth.getMonth()+1,lastSixMonth.getDate());
	
		ca.setTime(new Date());
		ca.add(Calendar.MONTH, -1); //年份减1  
		Date lastMonth = ca.getTime(); //结果  
		inMonth = checkDate(lastMonth.getYear()+1900,lastMonth.getMonth()+1,lastMonth.getDate());
		
		ca.setTime(new Date());
		ca.add(Calendar.DATE, -7); //年份减1  
		Date lastWeek = ca.getTime(); //结果  
		inWeek = checkDate(lastWeek.getYear()+1900,lastWeek.getMonth()+1,lastWeek.getDate());
		TimerTask task = new TimerTask() {
			@Override
			public void run() {
				try {
					starinWeekleaderboards = cl.CalStar(inWeek);
					starinMonthleaderboards = cl.CalStar(inMonth);
					starinHalfYearleaderboards = cl.CalStar(inHalfYear);
					starinYearleaderboards = cl.CalStar(inYear);
					
					forkinWeekleaderboards = cl.CalFork(inWeek);
					forkinMonthleaderboards = cl.CalFork(inMonth);
					forkinHalfYearleaderboards = cl.CalFork(inHalfYear);
					forkinYearleaderboards = cl.CalFork(inYear);
					
					followleaderboards = cl.CalFollow();
					
					
					sc.setAttribute("starinWeekleaderboards",starinWeekleaderboards);
					sc.setAttribute("starinMonthleaderboards", starinMonthleaderboards);
					sc.setAttribute("starinHalfYearleaderboards", starinHalfYearleaderboards);
					sc.setAttribute("starinYearleaderboards", starinYearleaderboards);
					
					sc.setAttribute("forkinWeekleaderboards", forkinWeekleaderboards);
					sc.setAttribute("forkinMonthleaderboards", forkinMonthleaderboards);
					sc.setAttribute("forkinHalfYearleaderboards", forkinHalfYearleaderboards);
					sc.setAttribute("forkinYearleaderboards", forkinYearleaderboards);
					
					sc.setAttribute("followleaderboards", followleaderboards);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		};
		timer = new Timer();
		//24小時跑一次
		timer.schedule(task,0, 24*60*60*1000);
	}
	public String checkDate(int year,int month,int date)
	{
		String monthString=Integer.toString(month);
		String dateString=Integer.toString(date);
		if(month<10)
			monthString="0"+month;
		if(date<10)
			dateString="0"+date;
		return year+"-"+monthString+"-"+dateString;
	}
	public void contextDestroyed(ServletContextEvent event) {}
}
