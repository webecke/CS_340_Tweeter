import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
    public async login (alias: string, password: string): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        let user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
    
        return [user, FakeData.instance.authToken];
    };

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string
      ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        let user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid registration");
        }
    
        return [user, FakeData.instance.authToken];
    };

    public async getIsFollowerStatus (
        authToken: string,
        userAlias: string,
        selectedUser: User
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    };

    public async getFolloweesCount (
        authToken: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(userAlias);
    };

    public async getFollowersCount (
        authToken: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(userAlias);
    };

    public async follow (
        authToken: string,
        userAliasToFollow: string
    ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.getFollowersCount(authToken, userAliasToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userAliasToFollow);
    
        return [followersCount, followeesCount];
    };

    public async unfollow (
        authToken: string,
        userAliasToUnfollow: string
    ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.getFollowersCount(authToken, userAliasToUnfollow);
        let followeesCount = await this.getFolloweesCount(authToken, userAliasToUnfollow);
    
        return [followersCount, followeesCount];
    };

    public async getUser (
        authToken: string,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };

    public async logout (authToken: string): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((res) => setTimeout(res, 1000));
    };
}