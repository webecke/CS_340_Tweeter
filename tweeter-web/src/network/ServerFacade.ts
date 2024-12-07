import {
  AuthRequest,
  AuthResponse,
    ChangeFollowRequest,
    CountResponse,
    IsFollowerRequest,
    IsFollowerResponse,
    PagedItemRequest,
    PagedItemResponse,
    PostStatusRequest,
    RegisterRequest,
    Status,
    StatusDTO,
    TweeterRequest,
    TweeterResponse,
    User,
    UserDTO,
    UserResponse,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://7yyg8n69ti.execute-api.us-west-1.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    private currentSessionToken: string | null = "STEVES MOM IS A GOAT";

    private static _instance: ServerFacade | null = null;
    public static get instance(): ServerFacade {
        if (this._instance === null) {
            this._instance = new ServerFacade();
        }
        return this._instance
    } 
  
    private async getMoreUserItems(
        request: PagedItemRequest<UserDTO>,
        endpoint: string,
        itemDescription: string
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
        PagedItemRequest<UserDTO>,
        PagedItemResponse<UserDTO>
      >(request, endpoint);
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDTO(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No ${itemDescription} found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message?.toString());
      }
    }

    private async getMoreStatusItems(
      request: PagedItemRequest<StatusDTO>,
      endpoint: string,
      itemDescription: string
  ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDTO>,
      PagedItemResponse<StatusDTO>
    >(request, endpoint);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDTO(dto) as Status)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${itemDescription} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message?.toString());
    }
  }

    public async getMoreFollowers(
        request: PagedItemRequest<UserDTO>
    ): Promise<[User[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return this.getMoreUserItems(request, "/follower/list", "followers")
    }

    public async getMoreFollowees(
      request: PagedItemRequest<UserDTO>
    ): Promise<[User[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return this.getMoreUserItems(request, "/followee/list", "followees")
    }

    public async getMoreFeedItems(
      request: PagedItemRequest<StatusDTO>
    ): Promise<[Status[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return this.getMoreStatusItems(request, "/feed/items", "feed items")
    }

    public async getMoreStoryItems(
      request: PagedItemRequest<StatusDTO>
    ): Promise<[Status[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return this.getMoreStatusItems(request, "/story/items", "story items")
    }

    public async doRegister(
      request: RegisterRequest
    ): Promise<AuthResponse> {
      const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthResponse
    >(request, "/auth/register");

      this.currentSessionToken = response.authToken._token
      return response
    }

    public async doLogin(
      request: AuthRequest
    ): Promise<AuthResponse> {
      const response = await this.clientCommunicator.doPost<
      AuthRequest,
      AuthResponse
    >(request, "/auth/login")

      console.log("LOGIN RESPONSE", response)

      this.currentSessionToken = response.authToken.token
      return response
    }

    public async doLogout(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      TweeterResponse
      >(request, "/auth/logout")

      this.currentSessionToken = null
      return response
    }

    public async postStatus(request: PostStatusRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
      >(request, "/status")
      return response
    }

    public async getFolloweesCount(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      CountResponse
      >(request, "/followee/count")
      return response
    }

    public async getFollowersCount(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      CountResponse
      >(request, "/follower/count")
      return response
    }

    public async getIsFollowerStatus(request: IsFollowerRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
      >(request, "/follower/check")
      return response
    }

    public async doFollow(request: ChangeFollowRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      ChangeFollowRequest,
      TweeterResponse
      >(request, "/follow")
      return response
    }

    public async doUnfollow(request: ChangeFollowRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      ChangeFollowRequest,
      TweeterResponse
      >(request, "/unfollow")
      return response
    }

    public async getUser(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      UserResponse
      >(request, "/user")
      return response
    }
  }
