package leaderboard;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;

import com.google.gson.Gson;

public class CalculateLeaderboard {

	public CalculateLeaderboard() {}
	//要改成ArrayList
//	public void CalStar() throws IOException {
	public static void main(String[] args) throws Exception {
		Gson gson = new Gson();
		
		//Create HttpURLConnection 
		HttpURLConnection httpcon = (HttpURLConnection) new URL("https://api.github.com/repos/goxr3plus/XR3Player/releases").openConnection();
//		httpcon.addRequestProperty("User-Agent", "Mozilla/5.0");
		BufferedReader in = new BufferedReader(new InputStreamReader(httpcon.getInputStream()));
		
		//Read line by line
		StringBuilder responseSB = new StringBuilder();
		String line="",inputLine;
		while ( ( inputLine = in.readLine() ) != null) {
			line += "\n"+inputLine;
//			responseSB.append("\n" + line);
//			System.out.println(line);
		}
		in.close();
		
//		Leaderboard test = gson.fromJson(line,Leaderboard.class);
//		System.out.println(test);
//		System.out.println(responseSB.toString().split("\"download_count\":").length);
		//Get Git Hub Downloads of XR3Player
//		Arrays.stream(responseSB.toString().split("\"download_count\":")).skip(1).map(l -> l.split(",")[0]).forEach(l -> System.out.println(l));
		
		//Sum up all download counts
//		int total = Arrays.stream(responseSB.toString().split("\"download_count\":")).skip(1).mapToInt(l -> Integer.parseInt(l.split(",")[0])).sum();
//		System.out.println("\nTotal Downloads: " + total);
	}
}
