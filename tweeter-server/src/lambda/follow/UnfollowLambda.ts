import { ChangeFollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: ChangeFollowRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.unfollow(
        request.token,
        request.userToFollowOrNot.alias
    ) 

    return {
        success: true,
        message: "Unfollowed!",
    }
}