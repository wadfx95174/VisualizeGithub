package leaderboard;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
public class LeaderboardServlet extends HttpServlet {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws IOException, ServletException {
		
//		ServletContext sc = request.getServletContext();
		
		GsonBuilder builder = new GsonBuilder();
		Gson gson = builder.setPrettyPrinting().create();
		response.getWriter().write((String)getServletContext().getAttribute("error"));
		response.setContentType("application/json");
//		System.out.println(gson.toJson((ArrayList<Leaderboard>)getServletContext().getAttribute("starinWeekleaderboards")));
//		response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)getServletContext().getAttribute("starinYearleaderboards")));
		response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)getServletContext().getAttribute("starinYearleaderboards")));
		response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)getServletContext().getAttribute("forkinYearleaderboards")));
		response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)getServletContext().getAttribute("followleaderboards")));
		
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ServletContext sc = request.getServletContext();
		  
		GsonBuilder builder = new GsonBuilder();
		Gson gson = builder.setPrettyPrinting().create();
		  
		response.setContentType("application/json");
		  
		  
		  switch(request.getParameter("action"))
		  {
		   case "starinWeek":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("starinWeekleaderboards")));
			   break;
		   case "starinMonth":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("starinMonthleaderboards")));
			   break;
		   case "starinHalfYear":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("starinHalfYearleaderboards")));
			   break;
		   case "starinYear":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("starinYearleaderboards")));
			   break;
		   case "forkinWeek":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("forkinWeekleaderboards")));
			   break;
		   case "forkinMonth":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("forkinMonthleaderboards")));
			   break;
		   case "forkinHalfYear":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("forkinHalfYearleaderboards")));
			   break;
		   case "forkinYear":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("forkinYearleaderboards")));
			   break;
		   case "follow":
			   response.getWriter().write(gson.toJson((ArrayList<Leaderboard>)sc.getAttribute("followleaderboards")));
			   break;
		   default:break;
		  }
	}

}
