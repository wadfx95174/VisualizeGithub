
package leaderboard;

public class Leaderboard {
	private int totalCount;
	private String fullName;
	private int stargazersCount;
	private int forksCount;
	private int watchCount;
	private int followCount;
	private String login;
	private String url;

	
	public String getUrl()
	{
		return url;
	}


	public void setUrl(String url)
	{
		this.url = url;
	}


	public String getLogin() {
		return login;
	}


	public void setLogin(String login) {
		this.login = login;
	}


	public int getFollowCount() {
		return followCount;
	}


	public void setFollowCount(int followCount) {
		this.followCount = followCount;
	}


	public Leaderboard() {}


	public int getTotalCount() {
		return totalCount;
	}


	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}


	public String getFullName() {
		return fullName;
	}


	public void setFullName(String fullName) {
		this.fullName = fullName;
	}


	public int getStargazersCount() {
		return stargazersCount;
	}


	public void setStargazersCount(int stargazersCount) {
		this.stargazersCount = stargazersCount;
	}


	public int getForksCount() {
		return forksCount;
	}


	public void setForksCount(int forksCount) {
		this.forksCount = forksCount;
	}


	public int getWatchCount() {
		return watchCount;
	}


	public void setWatchCount(int watchCount) {
		this.watchCount = watchCount;
	}

}
