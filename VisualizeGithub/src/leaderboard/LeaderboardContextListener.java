package leaderboard;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class LeaderboardContextListener implements ServletContextListener{

	public LeaderboardContextListener() {}
	public void contextInitialized(ServletContextEvent event) {
		ServletContext sc = event.getServletContext();
//		CalculateLeaderboard cl = new CalculateLeaderboard();
	}
	public void contextDestroyed(ServletContextEvent event) {}
}
