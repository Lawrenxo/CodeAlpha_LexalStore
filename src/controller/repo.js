import { UserRepo } from "./user.js";
import { OrderRepo } from "./order.js";
import { ProductRepo } from "./product.js";

class Repo {
    user() {
        return new UserRepo();
    }

    order() {
        return new OrderRepo();
    }

    product() {
        return new ProductRepo();
    }
}

export const repo = new Repo();