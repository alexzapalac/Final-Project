<template>
  <div class="main">
    <div class="menu">
      <p>
        <a><i class="fas fa-image"></i></a>
      </p>
      <h2>
        {{ user.firstName }} {{ user.lastName }}
        <a @click="logout"><i class="fas fa-sign-out-alt"></i></a>
      </h2>
    </div>
    <div class="header">
      <h2>Welcome to my page!</h2>
    </div>

    <div id="editUser">
      <button @click="setEditUserTrue()">Edit User</button>
      <div class="EditUserButton" v-if="editUser">
        <input type="text" v-model="firstName" placeholder="First Name" />
        <br />
        <input type="text" v-model="lastName" placeholder="Last Name" />
        <br />
        <input type="text" v-model="description" placeholder="Description" />
        <br />
        <input type="text" v-model="location" placeholder="Your Location" />
        <br />
        <input type="text" v-model="favorite" placeholder="Favorite Car" />
        <br />
        <button @click="editUserInfo(user)">Submit Changes</button>
      </div>
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="image">
          <img :src="person.Owns" />
        </div>
        <div class="info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>

          <h4>Description: {{ user.description }}</h4>
          <h4>Location: {{ user.location }}</h4>
          <h4>Favorite Car: {{ user.favorite }}</h4>
        </div>
      </div>
    </div>

    <div id="bar"></div>

    <div class="carHeader">
      <h3>My Car Collection</h3>
    </div>
    <!--
    <div class="add">
      <h3>Add a Vehicle</h3>
      <form class="addCar" @submit.prevent="upload">
        <fieldset>
          <input v-model="make" placeholder="Make" />
        </fieldset>
        <fieldset>
          <input v-model="model" placeholder="Model" />
        </fieldset>
        <fieldset>
          <input v-model="color" placeholder="Color" />
        </fieldset>
        <fieldset>
          <input v-model="year" placeholder="Year" />
        </fieldset>
        <fieldset>
          <div class="imageInput" @click="chooseImage">
            <img v-if="url" :src="url" />
            <div v-if="!url" class="placeholder">Choose an image</div>
            <input
              class="fileInput"
              ref="fileInput"
              type="file"
              @input="fileChanged"
            />
          </div>
          <p v-if="error" class="error">{{ error }}</p>
        </fieldset>
        <fieldset>
          <button type="submit" class="pure-button pure-button-primary right">
            Upload
          </button>
        </fieldset>
      </form>
    </div>-->
    <div class="theCars">
      <p>The Cars</p>
      <form @submit.prevent="addCars">
        <input type="text" v-model="make" placeholder="Make" />
        <br />
        <input type="text" v-model="model" placeholder="Model" />
        <br />
        <input type="text" v-model="color" placeholder="Color" />
        <br />
        <input type="text" v-model="year" placeholder="Year" />
        <br />
        <input type="file" name="carphoto" @change="fileChanged" />
        <button type="submit">Add Make Car</button>
      </form>
    </div>

    <div class="image" v-for="photo in photos" v-bind:key="photo._id">
      <div class="photoInfo">
        <p>Make: {{ photo.make }}</p>
        <p>Model: {{ photo.model }}</p>
        <p>Color: {{ photo.color }}</p>
        <p>Year: {{ photo.year }}</p>
      </div>
    </div>

    <div class="wrapcoll">
      <div class="contcoll" v-for="car in cars" :key="car._id">
        <div class="carImage">
          <img :src="car.path" />
        </div>

        <div class="infocoll">
          <p>Make: {{ car.make }}</p>
          <p>Model: {{ car.model }}</p>
          <p>Year: {{ car.year }}</p>
          <p>Color: {{ car.color }}</p>
        </div>

        <div class="buttons">
          <button @click="setEditTrue()">Edit Car</button>
          <div class="editButton" v-if="editItem">
            <input type="text" v-model="make" placeholder="Make" />
            <br />
            <input type="text" v-model="model" placeholder="Model" />
            <br />
            <input type="text" v-model="color" placeholder="Color" />
            <br />
            <input type="text" v-model="year" placeholder="Year" />
            <br />
            <button @click="editCar(car)">Submit Edit</button>
          </div>
          <button @click="deleteCar(car)">Remove Car</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserPage",
  props: {
    photos: Array,
  },
  data() {
    return {
      path: "",
      loading: false,
      person: {},
      cars: [],
      car: null,
      make: "",
      model: "",
      year: "",
      color: "",
      editItem: false,
      editUser: false,
      peopleName: "",
      description: "",
      location: "",
      favorite: "",
      firstName: "",
      lastName: "",
      make: "",
      model: "",
      color: "",
      year: "",
      error: "",
      file: null,
      url: "",
    };
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    setEditTrue() {
      this.editItem = true;
    },
    setEditUserTrue() {
      this.editUser = true;
    },
    async editUserInfo(user) {
      try {
        await axios.put(`/api/users/${user._id}`, {
          firstName: this.firstName,
          lastName: this.lastName,
          description: this.description,
          location: this.location,
          favorite: this.favorite,
        });
        this.user();
        (this.firstName = ""),
          (this.lastName = ""),
          (this.description = ""),
          (this.favorite = ""),
          (this.location = ""),
          (this.editUser = false);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0];
      this.url = URL.createObjectURL(this.file);
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append("photo", this.file, this.file.name);
        formData.append("make", this.make);
        formData.append("model", this.model);
        formData.append("color", this.color);
        formData.append("year", this.year);
        await axios.post("/api/photos", formData);
        this.file = null;
        this.url = "";
        this.make = "";
        this.model = "";
        this.color = "";
        this.year = "";
        this.$emit("uploadFinished");
      } catch (error) {
        this.error = "Error: " + error.response.data.message;
      }
    },

    async addCars() {
      try {
        const formData1 = new FormData();
        formData1.append("carphoto", this.file, this.file.name);
        let r1 = await axios.post("/api/users/carphotos", formData1);
        let r2 = await axios.post(`/api/users/${this.user._id}/cars`, {
          make: this.make,
          model: this.model,
          color: this.color,
          year: this.year,
          path: r1.data.path,
        });
        this.addItem = r2.data;
        this.make = "";
        this.model = "";
        this.year = "";
        this.path = "";
        this.getCars();
      } catch (error) {
        console.log(error);
      }
    },

    async getCars(){
      try {
        const response = await axios.get(`/api/users/${this.user._id}/cars`);
        this.cars = response.data;
      } catch(error) {
        console.log(error);
      }
    },
    
  },
};
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
}

.menu h2 {
  font-size: 14px;
}
</style>