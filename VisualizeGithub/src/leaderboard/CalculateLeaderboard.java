package leaderboard;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class CalculateLeaderboard {
	private static final String accessToken= "access_token=8e44037ef22880fff1340767b63d9947afb2e6be";
	private static final String accessToken2="access_token=05b8b660cab0b722562b4b8690cac309db6b397c";
	private static final String accessToken3="access_token=eb61d53220a841fab25d8b4f70904dd178232313";
	private static final String accessToken4="access_token=5b377afc4980d5eb8c84913ea01b0684160f7f92";
	private static final String accessToken5="access_token=eb61d53220a841fab25d8b4f70904dd178232313";
	private static final String accessToken6="access_token=65411542b774c621d02773067781b118efe1ce7a";
	private static final String accessToken7="access_token=80f13189bbeb1dafcd1ef37cc04e97e669a71143";
	private static final String accessToken8="access_token=7b2797e105897080e19b0eba56428fe55a8945ba"; // 翔
	private static final String accessToken9="access_token=2ceafa42746ddaa6e4bfa923e120ad5b7c0c0b7e"; // 哲
	public CalculateLeaderboard() {}
	//要改成ArrayList
//	public void CalStar() throws IOException {
	public static void main(String[] args) throws Exception {
		
//		ArrayList<Leaderboard> leaderboards = new ArrayList<Leaderboard>();
//		leaderboards = CalStar("2018-01-01");
//		GsonBuilder builder = new GsonBuilder();
//		Gson gson = builder.setPrettyPrinting().create();
//		System.out.println(gson.toJson(leaderboards));
//		Date date = new Date();
//		System.out.println((date.getYear()+1900)+"-"+(date.getMonth()+1)+"-"+date.getDate());
		
//		leaderboards = CalFollow();
//		GsonBuilder builder = new GsonBuilder();
//		Gson gson = builder.setPrettyPrinting().create();
//		System.out.println(gson.toJson(leaderboards));
	}
	public ArrayList<Leaderboard> CalStar(String date) throws MalformedURLException, IOException {
		String pushed = "pushed:>"+date;
		
		Leaderboard leaderboard;
		
		ArrayList<Integer> starCount = new ArrayList<Integer>();
		ArrayList<String> fullName = new ArrayList<String>();
		ArrayList<Leaderboard> leaderboards = new ArrayList<Leaderboard>();
		
		//Create HttpURLConnection 
		HttpURLConnection httpcon = (HttpURLConnection) new URL("https://api.github.com/search/repositories?q="+pushed+"&sort=stars&order=desc&per_page=100&"+accessToken8).openConnection();
		BufferedReader in = new BufferedReader(new InputStreamReader(httpcon.getInputStream()));
		
		//Read line by line
		StringBuilder responseSB = new StringBuilder();
		String line;
		while ( ( line = in.readLine() ) != null) {
			responseSB.append("\n" + line);
		}
		in.close();
		
		Arrays.stream(responseSB.toString().split("\"stargazers_count\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> starCount.add(Integer.parseInt(l)));
		Arrays.stream(responseSB.toString().split("\"full_name\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> fullName.add(l));
		
//		totalCount = Arrays.stream(responseSB.toString().split("\"total_count\":")).skip(1).mapToInt(l -> Integer.parseInt(l.split(",")[0])).sum();
//		System.out.println(totalCount);
		
		//api只允許存取前1000筆資料，所以page最多只能到10
		for(int i = 2 ;i <= 10;i++) {
			HttpURLConnection httpcon2 = (HttpURLConnection) new URL("https://api.github.com/search/repositories?q="+pushed+"&sort=stars&order=desc&page="+i+"&per_page=100&"+accessToken9).openConnection();
			BufferedReader in2 = new BufferedReader(new InputStreamReader(httpcon2.getInputStream()));
			
			StringBuilder responseSB2 = new StringBuilder();
			String line2;
			while ( ( line2 = in2.readLine() ) != null) {
				responseSB2.append("\n" + line2);
			}
			in2.close();
			
			Arrays.stream(responseSB2.toString().split("\"stargazers_count\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> starCount.add(Integer.parseInt(l)));
			Arrays.stream(responseSB2.toString().split("\"full_name\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> fullName.add(l));
		}
		for(int i = 0;i < starCount.size();i++) {
//			System.out.println(fullName.get(i).split("\"")[1]);
			leaderboard = new Leaderboard();
			leaderboard.setStargazersCount(starCount.get(i));
			leaderboard.setFullName(fullName.get(i).split("\"")[1]);
			leaderboard.setUrl("https://github.com/"+fullName.get(i).split("\"")[1]);
			leaderboards.add(leaderboard);
		}
		
		return leaderboards;
	}
	
	public ArrayList<Leaderboard> CalFork(String date) throws MalformedURLException, IOException {
		String pushed = "pushed:>"+date;
		
		Leaderboard leaderboard;
		
		ArrayList<Integer> frokCount = new ArrayList<Integer>();
		ArrayList<String> fullName = new ArrayList<String>();
		ArrayList<Leaderboard> leaderboards = new ArrayList<Leaderboard>();
		
		//Create HttpURLConnection 
		HttpURLConnection httpcon = (HttpURLConnection) new URL("https://api.github.com/search/repositories?q="+pushed+"&sort=forks&order=desc&per_page=100&"+accessToken8).openConnection();
		BufferedReader in = new BufferedReader(new InputStreamReader(httpcon.getInputStream()));
		
		//Read line by line
		StringBuilder responseSB = new StringBuilder();
		String line;
		while ( ( line = in.readLine() ) != null) {
			responseSB.append("\n" + line);
		}
		in.close();
		
		Arrays.stream(responseSB.toString().split("\"forks_count\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> frokCount.add(Integer.parseInt(l)));
		Arrays.stream(responseSB.toString().split("\"full_name\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> fullName.add(l));
		
		//api只允許存取前1000筆資料，所以page最多只能到10
		for(int i = 2 ;i <= 10;i++) {
			HttpURLConnection httpcon2 = (HttpURLConnection) new URL("https://api.github.com/search/repositories?q="+pushed+"&sort=forks&order=desc&page="+i+"&per_page=100&"+accessToken9).openConnection();
			BufferedReader in2 = new BufferedReader(new InputStreamReader(httpcon2.getInputStream()));
			
			StringBuilder responseSB2 = new StringBuilder();
			String line2;
			while ( ( line2 = in2.readLine() ) != null) {
				responseSB2.append("\n" + line2);
			}
			in2.close();
			
			Arrays.stream(responseSB2.toString().split("\"forks_count\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> frokCount.add(Integer.parseInt(l)));
			Arrays.stream(responseSB2.toString().split("\"full_name\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> fullName.add(l));
		}
		for(int i = 0;i < frokCount.size();i++) {
			leaderboard = new Leaderboard();
			leaderboard.setForksCount(frokCount.get(i));
			leaderboard.setFullName(fullName.get(i).split("\"")[1]);
			leaderboard.setUrl("https://github.com/" + fullName.get(i).split("\"")[1]);
			leaderboards.add(leaderboard);
		}
		return leaderboards;
	}
	
	public ArrayList<Leaderboard> CalFollow() throws MalformedURLException, IOException {
		
		Leaderboard leaderboard;
		
		ArrayList<Integer> followCount = new ArrayList<Integer>();
		ArrayList<String> login = new ArrayList<String>();
		ArrayList<Leaderboard> leaderboards = new ArrayList<Leaderboard>();
		
		//Create HttpURLConnection 
		HttpURLConnection httpcon = (HttpURLConnection) new URL(
				"https://api.github.com/search/users?q=followers:>0&sort=followers&order=desc&per_page=100&"+accessToken8).openConnection();
		BufferedReader in = new BufferedReader(new InputStreamReader(httpcon.getInputStream()));
		
		//Read line by line
		StringBuilder responseSB = new StringBuilder();
		String line;
		while ( ( line = in.readLine() ) != null) {
			responseSB.append("\n" + line);
		}
		in.close();
		
		Arrays.stream(responseSB.toString().split("\"login\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> login.add(l));
		
		//api只允許存取前1000筆資料，所以page最多只能到10
		for(int i = 2 ;i <= 10;i++) {
			HttpURLConnection httpcon2 = (HttpURLConnection) new URL("https://api.github.com/search/users?q=followers:>0&sort=followers&order=desc&page="+i+"&per_page=100&"+accessToken9).openConnection();
			BufferedReader in2 = new BufferedReader(new InputStreamReader(httpcon2.getInputStream()));
			
			StringBuilder responseSB2 = new StringBuilder();
			while ( ( line = in2.readLine() ) != null) {
				responseSB2.append("\n" + line);
			}
			in2.close();
			
			Arrays.stream(responseSB2.toString().split("\"login\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> login.add(l));
		
		}

		
		//用每個user的login去抓每個user的follow
		for(String log : login) {
			//Create HttpURLConnection 
			HttpURLConnection httpcon3 = (HttpURLConnection) new URL("https://api.github.com/users/"+log.split("\"")[1]+"?"+accessToken8).openConnection();
			BufferedReader in3 = new BufferedReader(new InputStreamReader(httpcon3.getInputStream()));
			
			//Read line by line
			StringBuilder responseSB3 = new StringBuilder();
			while ( ( line = in3.readLine() ) != null) {
				responseSB3.append("\n" + line);
			}
			in3.close();
			
			Arrays.stream(responseSB3.toString().split("\"followers\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> followCount.add(Integer.parseInt(l)));
		}
//		System.out.println(login.size());
//		System.out.println(followCount.size());
		
		for(int i = 0;i < followCount.size();i++) {
			leaderboard = new Leaderboard();
			leaderboard.setForksCount(followCount.get(i));
			leaderboard.setLogin((login.get(i).split("\"")[1]));
			leaderboard.setUrl("https://github.com/" + (login.get(i).split("\"")[1]));
			leaderboards.add(leaderboard);
		}
		return leaderboards;
	}
}

