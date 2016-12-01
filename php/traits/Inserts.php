<?php
	trait Inserts {
		public function teach($post)
        {
            $json = array();

            $query = $this->db->prepare("
                insert into TrainData (fecha, data, charcode) 
                values (now(), :traindata, :charcode)
            ");

            $query->execute(array(
                ":traindata" => $post['traindata'],
                ":charcode" => $post['charcode']
            ));

            $json["status"] = "ok";
            $json["msg"] = "Gracias, lo tendré en cuenta.";

            return json_encode($json);
        }
	}
?>