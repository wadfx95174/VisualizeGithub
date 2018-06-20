package leaderboard;

import javax.servlet.*;
import javax.servlet.http.*;

import java.io.*;
import java.util.*;

public class LeaderboardServlet extends HttpServlet {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws IOException, ServletException {
		
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
			case default:
			break;
		}
		
			
	}
}