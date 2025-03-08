
@Table("reservation")
@PrimaryKey("reservation_id")
export class Reservation extends Model {
    @Column("reservation_id")
    public ReservationId: number;

    @Column("amount_of_people")
    public AmountOfPeople: number;

    @Column("reservation_time")
    public ReservationTime: Date;

    @ForeignKey(Account)
    @DifferentlyNamedForeignKey("CustomerId")
    @Column("customer_id")
    public Customer: Account | undefined;

    @ForeignKey(Account)
    @DifferentlyNamedForeignKey("TrainerId")
    @Column("trainer_id")
    public Trainer: Account | undefined;

    @ForeignKey(Plan)
    @Column("plan_id")
    public Plan: Plan | undefined;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.ReservationId = jsonData["reservation_id"] ?? jsonData["ReservationId"];
        this.AmountOfPeople = jsonData["amount_of_people"] ?? jsonData["AmountOfPeople"];
        this.ReservationTime = jsonData["reservation_time"] ?? jsonData["ReservationTime"];
        if (jsonData["customer"]) {
            this.Customer = new Account(jsonData["customer"]);
        } else {
            const tmp = { ...jsonData }
            tmp["account_id"] = tmp["customer_id"] ?? jsonData["CustomerId"]
            this.Customer = new Account(tmp)
            if (!this.Customer.AccountId) {
                this.Customer = undefined
            }
        }

        if (jsonData["trainer"]) {
            this.Trainer = new Account(jsonData["trainer"]);
        } else {
            const tmp = { ...jsonData }
            tmp["account_id"] = tmp["trainer_id"] ?? jsonData["TrainerId"]
            this.Trainer = new Account(tmp)
            if (!this.Trainer.AccountId) {
                this.Trainer = undefined
            }
        }

        if (jsonData["Plan"]) {
            this.Plan = new Plan(jsonData["Plan"]);
        }
        else if (jsonData["plan"]) {
            this.Plan = new Plan(jsonData["plan"]);
        } else {
            this.Plan = new Plan(jsonData)

            if (!this.Plan.PlanId) {
                this.Plan = undefined
            }
        }
    }
}
