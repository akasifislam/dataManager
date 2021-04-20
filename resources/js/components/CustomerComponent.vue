<template>
  <div id="customer">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Customers</h4>
            <div
              class="card-tools"
              style="position: absolute; right: 1rem; top: 0.5rem"
            >
              <button @click="reload" type="button" class="btn btn-primary">
                <i class="fas fa-sync"></i>
              </button>
              <button @click="create" type="button" class="btn btn-success">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="mb-3">
              <div class="row">
                <div class="col-md-2">
                  <strong>Search By:</strong>
                </div>
                <div class="col-md-3">
                  <select id="fields" class="form-control" v-model="queryField">
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="total">Total</option>
                    <option value="address">Address</option>
                  </select>
                </div>
                <div class="col-md-7">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="search"
                    v-model="query"
                  />
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table
                class="table table-hover table-bordered table-stpered table-striped"
              >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Total</th>
                    <th scope="col" class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(customer, index) in customers" :key="customer.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.total }}</td>
                    <td>
                      <a href="" class="btn btn-success"
                        ><i class="fas fa-eye"></i
                      ></a>
                      <a href="" class="btn btn-primary"
                        ><i class="fas fa-edit"></i
                      ></a>
                      <a href="" class="btn btn-danger"
                        ><i class="fas fa-trash"></i
                      ></a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <pagination
                v-if="pagination.last_page > 1"
                :pagination="pagination"
                :offset="5"
                @paginate="getData()"
              ></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ============== modal ================= -->
    <div
      class="modal fade"
      id="customerModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="customerModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="customerModalLabel">
              Add New Customer
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="storeData" @keydown="form.onKeydown($event)">
            <div class="modal-body">
              <alert-error :form="form"></alert-error>
              <div class="form-group">
                <label>Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input
                  v-model="form.email"
                  type="text"
                  name="email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  v-model="form.phone"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('phone') }"
                />
                <has-error :form="form" field="phone"></has-error>
              </div>
              <div class="form-group">
                <label>Address</label>
                <textarea
                  v-model="form.address"
                  name="address"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('address') }"
                ></textarea>
                <has-error :form="form" field="address"></has-error>
              </div>
              <div class="form-group">
                <label>Total</label>
                <input
                  v-model="form.total"
                  type="number"
                  step="0.01"
                  name="total"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('total') }"
                />
                <has-error :form="form" field="total"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                :disabled="form.busy"
                type="submit"
                class="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      queryField: "name",
      customers: [],
      form: new Form({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        total: "",
      }),
      pagination: {
        current_page: 1,
      },
    };
  },
  watch: {
    query: function (newQ, old) {
      if (newQ === "") {
        this.getData();
      } else {
        this.searchData();
      }
    },
  },
  mounted() {
    console.log("Component mounted.");
    this.getData();
  },
  methods: {
    getData() {
      this.$Progress.start();
      axios
        .get("/api/customers?page=" + this.pagination.current_page)
        .then((response) => {
          this.customers = response.data.data;
          this.pagination = response.data.meta;
          this.$Progress.finish();
        })
        .catch((e) => {
          console.log(e);
          this.$Progress.fail();
        });
    },
    searchData() {
      this.$Progress.start();
      axios
        .get(
          "/api/search/customers/" +
            this.queryField +
            "/" +
            this.query +
            "?page=" +
            this.pagination.current_page
        )
        .then((response) => {
          this.customers = response.data.data;
          this.pagination = response.data.meta;
          this.$Progress.finish();
        })
        .catch((e) => {
          console.log(e);
          this.$Progress.fail();
        });
    },
    reload() {
      this.getData();
      this.query = "";
      this.queryField = "name";
      this.$snotify.success("Data reloded", "success");
    },
    create() {
      this.form.reset();
      this.form.clear();
      $("#customerModal").modal("show");
    },
    storeData() {
      this.$Progress.start();
      this.form.busy = true;
      this.form
        .post("/api/customers")
        .then((response) => {
          this.getData();
          $("#customerModal").modal("hide");
          if (this.form.successful) {
            this.$Progress.finish();
            this.$snotify.success("Data store", "Success");
          } else {
            this.$Progress.fail();
            this.$snotify.error("Data dont store", "Error");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
